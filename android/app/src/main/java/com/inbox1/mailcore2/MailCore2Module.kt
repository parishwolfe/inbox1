package com.inbox1.mailcore2

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.libmailcore.Address
import com.libmailcore.ConnectionType
import com.libmailcore.IMAPFetchMessagesOperation
import com.libmailcore.IMAPMessage
import com.libmailcore.IMAPMessagesRequestKind
import com.libmailcore.IMAPSearchExpression
import com.libmailcore.IMAPSearchOperation
import com.libmailcore.IMAPSession
import com.libmailcore.MailException
import com.libmailcore.OperationCallback
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone

class MailCore2Module(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String = "MailCore2"

  @ReactMethod
  fun fetchUnread(config: ReadableMap, promise: Promise) {
    val host = config.getString("host") ?: ""
    val username = config.getString("username") ?: ""
    val password = config.getString("password") ?: ""
    val port = if (config.hasKey("port")) config.getInt("port") else -1
    val security = (config.getString("security") ?: "ssl").lowercase(Locale.US)

    if (host.isBlank() || username.isBlank() || password.isBlank() || port <= 0) {
      promise.reject("mailcore_invalid_config", "Missing required IMAP configuration.")
      return
    }

    val session = IMAPSession()
    session.setHostname(host)
    session.setPort(port)
    session.setUsername(username)
    session.setPassword(password)
    session.setConnectionType(
      when (security) {
        "ssl" -> ConnectionType.ConnectionTypeTLS
        "starttls" -> ConnectionType.ConnectionTypeStartTLS
        else -> ConnectionType.ConnectionTypeClear
      },
    )

    val searchOp: IMAPSearchOperation = session.searchOperation("INBOX", IMAPSearchExpression.searchUnread())
    searchOp.start(object : OperationCallback {
      override fun succeeded() {
        val uids = searchOp.uids()
        if (uids == null || uids.count() == 0) {
          promise.resolve(Arguments.createArray())
          return
        }

        val fetchOp: IMAPFetchMessagesOperation = session.fetchMessagesByUIDOperation(
          "INBOX",
          IMAPMessagesRequestKind.IMAPMessagesRequestKindHeaders,
          uids,
        )

        fetchOp.start(object : OperationCallback {
          override fun succeeded() {
            val messages = fetchOp.messages() ?: emptyList<IMAPMessage>()
            val formatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
            formatter.timeZone = TimeZone.getTimeZone("UTC")

            val results = Arguments.createArray()
            for (message in messages) {
              val header = message.header()
              val from = formatAddress(header?.from())
              val subject = header?.subject() ?: ""
              val date = header?.date()?.let { formatter.format(it) } ?: ""

              val entry = Arguments.createMap()
              entry.putString("id", message.uid().toString())
              entry.putString("from", from)
              entry.putString("subject", subject)
              entry.putString("date", date)
              results.pushMap(entry)
            }

            promise.resolve(results)
          }

          override fun failed(exception: MailException) {
            promise.reject("mailcore_fetch_failed", exception.message, exception)
          }
        })
      }

      override fun failed(exception: MailException) {
        promise.reject("mailcore_search_failed", exception.message, exception)
      }
    })
  }

  private fun formatAddress(address: Address?): String {
    if (address == null) {
      return ""
    }

    val displayName = address.displayName() ?: ""
    val mailbox = address.mailbox() ?: ""

    return when {
      displayName.isNotBlank() && mailbox.isNotBlank() -> "$displayName <$mailbox>"
      mailbox.isNotBlank() -> mailbox
      else -> displayName
    }
  }
}
