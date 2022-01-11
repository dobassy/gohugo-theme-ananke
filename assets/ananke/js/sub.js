window.addEventListener("DOMContentLoaded", () => {
  setTocActiveStateObserver();

  addNewWindowIconForExternalLink();

  createFaqSchema();
});

function setTocActiveStateObserver() {
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
}

function clearActiveStatesInTableOfContents() {
  document.querySelectorAll("nav li").forEach((section) => {
    section.classList.remove("active");
  });
}

function addNewWindowIconForExternalLink() {
  const domain = document.domain;
  const regexp = new RegExp(domain);

  document.querySelectorAll("div.article-body a").forEach((element) => {
    let href = element.getAttribute("href");
    if (!regexp.test(href)) {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "nofollow noopener");
    }
  });
}

function createFaqSchema() {
  let questions = document.querySelectorAll(".question-section");
  if (!questions.length) {
    return false;
  }

  const entities = [];
  questions.forEach((section) => {
    let question = section.querySelector(".question").innerText;
    let answer = section.querySelector(".answer").innerHTML.trim();
    entities.push(createQuestionEntity(question, answer));
  });

  const schemaBody = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entities,
  };

  createSchemaElement(JSON.stringify(schemaBody));
}

function createSchemaElement(structuredDataText) {
  const script = document.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.textContent = structuredDataText;
  document.head.appendChild(script);
}

function createQuestionEntity(question, answer) {
  if (!question) {
    return false;
  }
  if (!answer) {
    return false;
  }

  return {
    "@type": "Question",
    name: `${question}`,
    acceptedAnswer: {
      "@type": "Answer",
      text: `${answer}`,
    },
  };
}
