window.addEventListener("DOMContentLoaded", () => {
  const tocActiveStateObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      if (entry.intersectionRatio > 0) {
        clearActiveStatesInTableOfContents();

        document
          .querySelector(`nav li a[href="#${id}"]`)
          .parentElement.classList.add("active");
      }
    });
  });

  document
    .querySelectorAll("h1[id],h2[id],h3[id],h4[id]")
    .forEach((section) => {
      tocActiveStateObserver.observe(section);
    });
});

window.addEventListener("DOMContentLoaded", () => {
  const domain = document.domain;
  const regexp = new RegExp(domain);

  document.querySelectorAll("div.article-body a").forEach((element) => {
    let href = element.getAttribute("href");
    if (!regexp.test(href)) {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "nofollow noopener");
    }
  });
});

function clearActiveStatesInTableOfContents() {
  document.querySelectorAll("nav li").forEach((section) => {
    section.classList.remove("active");
  });
}
