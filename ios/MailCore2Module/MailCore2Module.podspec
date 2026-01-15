Pod::Spec.new do |s|
  s.name = "MailCore2Module"
  s.version = "0.0.1"
  s.summary = "MailCore2 React Native bridge"
  s.homepage = "https://github.com/MailCore/mailcore2"
  s.license = { :type => "UNLICENSED" }
  s.author = "Inbox1"
  s.platform = :ios, "13.0"
  s.source = { :git => "https://github.com/MailCore/mailcore2.git", :tag => s.version.to_s }
  s.source_files = "*.{h,m,mm}"
  s.requires_arc = true
  s.dependency "React-Core"
  s.dependency "mailcore2-ios"
end
