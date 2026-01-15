#import "MailCore2Module.h"
#import <MailCore/MailCore.h>

static NSString *MailCore2AddressString(MCOAddress *address) {
  if (address == nil) {
    return @"";
  }

  NSString *displayName = address.displayName ?: @"";
  NSString *mailbox = address.mailbox ?: @"";

  if (displayName.length > 0 && mailbox.length > 0) {
    return [NSString stringWithFormat:@"%@ <%@>", displayName, mailbox];
  }
  if (mailbox.length > 0) {
    return mailbox;
  }
  return displayName;
}

@implementation MailCore2Module

RCT_EXPORT_MODULE(MailCore2)

RCT_REMAP_METHOD(fetchUnread,
                 fetchUnread:(NSDictionary *)config
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *host = config[@"host"];
  NSNumber *portNumber = config[@"port"];
  NSString *username = config[@"username"];
  NSString *password = config[@"password"];
  NSString *security = config[@"security"];

  if (host.length == 0 || username.length == 0 || password.length == 0 || portNumber == nil) {
    reject(@"mailcore_invalid_config", @"Missing required IMAP configuration.", nil);
    return;
  }

  MCOIMAPSession *session = [[MCOIMAPSession alloc] init];
  session.hostname = host;
  session.port = portNumber.unsignedIntValue;
  session.username = username;
  session.password = password;
  session.connectionType = MCOConnectionTypeClear;

  if ([security isEqualToString:@"ssl"]) {
    session.connectionType = MCOConnectionTypeTLS;
  } else if ([security isEqualToString:@"starttls"]) {
    session.connectionType = MCOConnectionTypeStartTLS;
  }

  MCOIMAPSearchExpression *expr = [MCOIMAPSearchExpression searchUnread];
  MCOIMAPSearchOperation *searchOp = [session searchExpressionOperationWithFolder:@"INBOX" expression:expr];
  [searchOp start:^(NSError *error, MCOIndexSet *searchResult) {
    if (error != nil) {
      reject(@"mailcore_search_failed", error.localizedDescription ?: @"Search failed.", error);
      return;
    }

    if (searchResult == nil || [searchResult count] == 0) {
      resolve(@[]);
      return;
    }

    MCOIMAPFetchMessagesOperation *fetchOp = [session fetchMessagesOperationWithFolder:@"INBOX"
                                                                           requestKind:MCOIMAPMessagesRequestKindHeaders
                                                                                  uids:searchResult];
    [fetchOp start:^(NSError *fetchError, NSArray *messages, MCOIndexSet *vanishedMessages) {
      if (fetchError != nil) {
        reject(@"mailcore_fetch_failed", fetchError.localizedDescription ?: @"Fetch failed.", fetchError);
        return;
      }

      NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
      formatter.locale = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
      formatter.timeZone = [NSTimeZone timeZoneWithAbbreviation:@"UTC"];
      formatter.dateFormat = @"yyyy-MM-dd'T'HH:mm:ss'Z'";

      NSMutableArray *results = [NSMutableArray arrayWithCapacity:messages.count];
      for (MCOIMAPMessage *message in messages) {
        MCOMessageHeader *header = message.header;
        NSString *subject = header.subject ?: @"";
        NSString *from = MailCore2AddressString(header.from);
        NSString *dateString = @"";
        if (header.date != nil) {
          dateString = [formatter stringFromDate:header.date];
        }

        [results addObject:@{
          @"id": [NSString stringWithFormat:@"%llu", message.uid],
          @"subject": subject,
          @"from": from,
          @"date": dateString,
        }];
      }

      resolve(results);
    }];
  }];
}

@end
