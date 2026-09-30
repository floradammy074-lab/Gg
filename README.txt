BANKING APP (mobile UI prototype)
=================================

FILES
  index.html     Page structure
  style.css      All styling
  script.js      Avatar faces + transfer flow logic
  manifest.json  Web app manifest (name, colours, icon)
  sw.js          Service worker (needed for phone notifications)
  icon-192.png, icon-512.png, apple-touch-icon.png   App icons (also used in notifications)
  README.txt     This file

HOW TO RUN
  1. Keep all files in the same folder.
  2. Double-click index.html to open it in a browser.
     (For best results view at phone width, or use browser
     dev tools > device toolbar.)
  3. To test the manifest / "Add to Home Screen", serve the
     folder over http, e.g.:  python3 -m http.server 8000
     then open http://localhost:8000

NOTES
  - Processing and success are bottom-sheet pop-ups shown after PIN entry (paper plane, badge + confetti).
  - Avatars and Upwork/Netflix/Starbucks logos are drawn
    inline as SVG. Replace them with your own images by
    editing index.html and script.js.
  - Colours and sizes are in style.css.
  - The bottom bar is a frosted-glass pill (see "Floating frosted-glass pill nav" in style.css).

RECEIPT & NOTIFICATION
  - The success pop-up rises to about 86% of the screen and lists recipient, account number, bank,
    date/time and a generated reference number (TXN + 9 digits, the same one used in the notification) under the amount. The pending pop-up is a little taller than before.
  - About 1.4s after a successful transfer the app sends a real phone notification
    ("Transaction Successful" with amount, recipient, reference, date, available balance and a thank-you line). If the phone can't show one,
    an in-app banner drops from the top instead.
  - Phone notifications need: (1) the app served over https:// (or localhost) - not opened as a file,
    (2) permission - asked when you tap Transfer, or use Settings > Notifications,
    (3) on iPhone (iOS 16.4+): Safari > Share > Add to Home Screen, then open the app from the Home Screen icon.
  - Notifications are triggered by the app itself (no server), so the app must still be running
    when the transfer finishes. Real bank alerts while the app is closed need a push server.

SETTINGS
  - Tap "Settings" in the bottom bar: theme colour (purple/red/green/light blue/grey),
    Light/Dark mode and USD/NGN currency. Choices are remembered on the device.
  - NGN rate is the RATE constant at the top of script.js (default 1 USD = 1,500 NGN).

PIN & KEYBOARD
  - Tapping "Send money" opens a 4-digit PIN popup. Default PIN is 1472.
    Change it in Settings > Security > Change transaction PIN (current -> new -> confirm).
    The PIN is stored on the device (localStorage) - prototype only; a real app must verify it on a server.
  - The popup and the transfer form are positioned above the phone keyboard using the
    visualViewport API (see fit() in script.js).
