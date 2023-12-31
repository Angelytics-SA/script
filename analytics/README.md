![alt text](test/favicon.ico)
# *Angelytics:* The Analytics Script

Angelytics is a SAAS platforms that provides safe and regulation (like HIPAA) compliant analytics. It also allows you to work with your current analytic tools such as Meta Pixel (Pixel), Google Analytics (GA) and Google Tag Manager (GTM).

## Table Of Contents
- [*Angelytics:* The Analytics Script](#angelytics-the-analytics-script)
  - [Table Of Contents](#table-of-contents)
- [How to Install The Script](#how-to-install-the-script)
- [Angelytics-Specific Analytics Collected And Sent To The Server](#angelytics-specific-analytics-collected-and-sent-to-the-server)
- [How to build/bundle the analytics script](#how-to-buildbundle-the-analytics-script)


# How to Install The Script

See [example](test/index.html).

Place the following html script element before your other analytics scripts, and preferably righ under the ***head*** tag. For example:

      <head>
        <script
          src="https://angelytics-sa.github.io/script/analytics.js"
          type="text/javascript"
          account="<your-account-id>"
          ...
        ></script>

        <!-- GOOGLE ANALYTICS | Google tag (gtag.js) -->
        <script>...</script>

        <!-- PIXEL -->
        <script>...</script>

The script takes different variables:
- **src:** *Required*. [Where](https://angelytics-sa.github.io/script/analytics.js) to download the analytics from.
- **account:** *Required*. Your account id, provided by Angelytics.
- **ga:** *Optional*. Your Google Analytics account ids to send the analytics to, if you want to visualize them on your current GA dashboard. Ex: ga="G-0123456789" or ga="G-0123456789 G-ABCDEFGHIJ G-KLMNOPQRST" for multiple accounts.
- **fbq:** *Optional*. Your Pixel account ids to send the analytics to, if you want to visualize them on your current Pixel dashboard. Ex: fbq="vnlenvnepo" or fbq="coaencon 12e3ohcc 09uslnca" for multiple accounts.
- **patch:** *Optional*. If used, it will patch the GA, Pixel, etc existing technology. If not present, Angelytics will try to prevent the execution of other analytic scripts. For example the follow settup:

      <head>
        <script
          src="https://angelytics-sa.github.io/script/analytics.js"
          type="text/javascript"
          account="<your-account-id>"
          ga="G-0123456789"
        ></script>

        <!-- GOOGLE ANALYTICS | Google tag (gtag.js) | PROPERTY #1 -->
        <!-- WON'T BE EXECUTED AND WILL BE REMOVED -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0123456789"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-0123456789');
        </script>

        <!-- SECOND GOOGLE ANALYTICS | Google tag (gtag.js) PROPERTY #2 -->
        <!-- WON'T BE EXECUTED AND WILL BE REMOVED -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ABCDEFGHIJ"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-ABCDEFGHIJ');
        </script>
        ...

    will send analytics to the GA account G-0123456789 using Angelitics tracking technology and prevent the execution of the GA scripts below (both G-0123456789 and G-ABCDEFGHIJ) and remove them from the DOM. However adding the flag *patch* will use directly GA's tracking technology to first collect analytics client side for G-0123456789, then it will filter/mask sensitive data, like data found in forms or the user IP address, Angelytcis server side, ***before*** sending the analytics to Google's servers. Then it will remove the scripts related to G-ABCDEFGHIJ:

      <head>
        <script
          src="https://angelytics-sa.github.io/script/analytics.js"
          type="text/javascript"
          account="<your-account-id>"
          ga="G-0123456789 G-ABCDEFGHIJ"
          patch
        ></script>

        <!-- GOOGLE ANALYTICS | Google tag (gtag.js) | PROPERTY #1 -->
        <!-- WILL BE EXECUTED BUT FILTERED SERVER SIDE -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0123456789"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-0123456789');
        </script>

        <!-- SECOND GOOGLE ANALYTICS | Google tag (gtag.js) PROPERTY #2 -->
        <!-- WON'T BE EXECUTED AND WILL BE REMOVED -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ABCDEFGHIJ"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-ABCDEFGHIJ');
        </script>
        ...

    See [example](test/index.html).

- **disable-cookies**: *Optional*. If added, will prevent further tracking technology to access or modify cookies. For example:

      <head>
        <script
          src="https://angelytics-sa.github.io/script/analytics.js"
          type="text/javascript"
          account="<your-account-id>"
          disable-cookies
        ></script>
        ...

- **allow-all**: *Optional*. If added, will allow further tracking script to be executed, even if the flag *patch* is not set. For example:

      <head>
        <script
          src="https://angelytics-sa.github.io/script/analytics.js"
          type="text/javascript"
          account="<your-account-id>"
        ></script>

        <!-- GOOGLE ANALYTICS | Google tag (gtag.js) | PROPERTY #1 -->
        <!-- WON'T BE EXECUTED AND WILL BE REMOVED -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0123456789"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-0123456789');
        </script>
        ...

        will remove the GA scripts, while the following:

      <head>
        <script
          src="https://angelytics-sa.github.io/script/analytics.js"
          type="text/javascript"
          account="<your-account-id>"
          allow-all
        ></script>

        <!-- GOOGLE ANALYTICS | Google tag (gtag.js) | PROPERTY #1 -->
        <!-- WILL BE EXECUTED AND WILL NOT BE FILTERED SERVER SIDE -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0123456789"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-0123456789');
        </script>
        ...

    will let the GA script slides, without trying to patch it.

- **callback**: *Optional*. Specify the name of the function that will replace sending the analytics to Angelytics servers. For example:
      
      <head>
        <!-- Function to replace the sending the data to Angelytics server -->
        <script>
          myFunction = data => console.log('METADATA SENT:', data);
        </script>

        <!-- Angelytics script -->
        <script
          src="https://angelytics-sa.github.io/script/analytics.js"
          type="text/javascript"
          account="<your-account-id>"
          callback="myFunction"
        ></script>
        ...

- **encription-key**: *Optional*. If specified, the sensitive part of the data will be automatically encripted before it is sent to Angelytics servers. For example:

      <head>
        <script
          src="https://angelytics-sa.github.io/script/analytics.js"
          type="text/javascript"
          account="<your-account-id>"
          encryption-key="$2b$10$C7XZ0twPgjfWL406wlImveqDgEfsgUgYZzip4lOWG.ApaXgrn2Zea"
        ></script>
        ...

# Angelytics-Specific Analytics Collected And Sent To The Server

    {
      "platform": { // platform related information
        "browser": <string enum> safari|chrome|chromium|seamonkey|firefox|opera|ie,
        "renderingEngine": <string enum> edge|blink|gecko|webkit,
        "windowSizeType": <string enum> desktop|phone|tablet|large-tablet,
        "mobileType": <string enum> ios|android|windows|other|,
        "hasTouchScreen": <bool> true|false,
        "language": <string> like "en-US"
      },
      "page": { // page related information
        "location": <string> like "http://localhost:3000/",
        "title": <string> like"Test Page"
      },
      "timeAndGeolocation": { // time and geolocation info
        "date": <number> like 1694198198544,
        "timeZoneOffset": <number> like 7,
        "timeZone": <string> like "America/Los_Angeles"
      },
      "ids": { // list of ids relevant for the analytics
        "session": <string> like "jGNF57mOnz_vSDZuekqEXhc3QJ8iyrQW",
        "account": <string> like "$2b$10$C7XZ0twPgjfWL406wlImveqDgEfsgUgYZzip4lOWG.ApaXgrn2Zea",
        "otherAnalyticsToFeed": { **OPTIONAL**
          "ga": <array> like ["G-1234567890"],
          "fbq": <array>
        },
        "otherAnalyticsDetected": { **OPTIONAL**
          "ga": <array> like ["G-ABCDEFGHIJ"],
          "fbq": <array>
        }
      },
      "element": { // targetted element
        "x": <number> like 0,
        "y": <number> like 0,
        "width": <number> like 807,
        "height": <number> like 703,
        "identifier": <string> like "angelytics-unique-body-id-1",
        "tagName": <string> like "body"
      },
      "event": { // event that triggered the analytics
        "type": <string> like "session",
        "name": <string> like "start",
        "tags": <array> like ["design", "sales"],
        "body": <any> **OPTIONAL**
      },
      "flags": { // flags and config used for the analytics
        "patch": <bool>,
        "allowAll": <bool>,
        "disableCookies": <bool>,
        "encrypted": <bool> or <aray>
      },
      "cookies": { // Cookies present in the page
        "key_1": "value_1",
        ...,
        "key_n": "value_n"
      }
    }

# How to build/bundle the analytics script

We use webpack to create and bundle the analytics script. The [bundle tool](https://github.com/Angelytics-SA/utils/blob/master/bundle.js) can be launch using the command line:

    NODE_ENV=PROD node <path-to-utils>/bundle -i <path-to-scripts>/analytics/index.js -o <path-to-analytics>/analytics.js