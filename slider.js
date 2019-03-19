function getListItems(query) {
  const requestHeaders = {
    accept: "application/json;odata=verbose",
    "X-FORMS_BASED_AUTH_ACCEPTED": "f",
    "X-RequestDigest": $("#__REQUESTDIGEST").val()
  };

  return $.ajax({
    url: query,
    method: "GET",
    contentType: "application/json;odata=verbose",
    headers: requestHeaders
  });
}

SP.SOD.executeFunc("sp.js", "SP.ClientContext", myFunction);

function myFunction() {
  const query =
    _spPageContextInfo.webAbsoluteUrl +
    "/_api/lists/getbytitle('images')/items?$select=*,FileRef/FileRef";
  getListItems(query)
    .then(result => {
      const images = result.d.results;

      const imagesHTML = images.map(item => {
        return `    
        <div class="mySlides">        
        <img src="${item.FileRef}"> 
        </div>            
            `;
      });
      const finalHTML = imagesHTML.join("");

      document.getElementById("injection1").innerHTML = finalHTML;
      // ниже идет слайдер

      var slideIndex = 1;
      showSlides();

      function showSlides() {
        var i;
        var slides = document.getElementsByClassName("mySlides");

        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) {
          slideIndex = 1;
        }

        $(".mySlides")
          .filter(function(index) {
            return index === slideIndex - 1;
          })
          .fadeToggle("slow", "linear");

        setTimeout(showSlides, 2500);
      }
      //Здесь заканчивается слайдер
    })
    .fail(error => {
      console.log(error);
    });
}
