uploadFileToAzure = function(dataToUpload) //pwned
{

  var accessKey = CryptoJS.enc.Base64.parse("4pcdyguVQxIqgWymgn0HlyGhMFFHXryFZB3U4n4elchp59KftGDdkrT8wkZ2vZzfjGGuvBYGfziQMw2yOmo6CA==");

  var method = "PUT";

  // e.g. "Sat, 12 Sep 2015 20:48:53 GMT"
  var now = new Date();
  var utc_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
  var date = utc_now.toString("ddd, dd MMM yyyy HH:mm:ss") + " GMT";

  var account = "musicserverstorage";
  var container = "container1";
  var blob = "blob123"

  // See https://msdn.microsoft.com/en-us/library/azure/dd179428.aspx
  var text =  method + "\n\n" + 
        "application/x-www-form-urlencoded; charset=UTF-8" + "\n\n" +
        "x-ms-blob-type:BlockBlob" + "\n" +
        "x-ms-date:" + date + "\n" +
        "/" + account + "/" + container + "/" + blob;

  var body = unescape(encodeURIComponent(text));
  var encodedBits = CryptoJS.HmacSHA256(body, accessKey);
  var base64Bits = CryptoJS.enc.Base64.stringify(encodedBits);

  alert("About to upload file!");

  $.ajax({
    url: "https://" + account + ".blob.core.windows.net/" + container + "/" + blob,
    type: "PUT",
    data: dataToUpload,
    processData: false,
    beforeSend: function (xhr)
      {
         xhr.setRequestHeader('x-ms-date', date);
         xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
         xhr.setRequestHeader('Authorization', 'SharedKey ' + account + ':' + base64Bits)
      }
     });
}