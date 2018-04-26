(async () => {
  "use strict";

  const CONSTANTS = {
    DEBOUNCE_TIME_IN_MS: 75,
    FAKE_AJAX_TIME_DELAY_IN_MS: 1000,

    INVALID_ACCORDEON_DATA_FORMAT_EXCEPTION: "Q&A Data should be passed as an array"
  };

  const accordeonContainer = document.getElementById("accordeon");
  const loadingSpinner = document.getElementById("loading-spinner");

  // Fake AJAX call
  const getQuestionAndAnswersData = () => new Promise(resolve => {
    setTimeout(() => {
      const questionAndAnswersData = [
        {
          question: "What is Salmon about?",
          answer: "He is all about JavaScript"
        },
        {
          question: "What is the location of Salmon Watford?",
          answer: "Just 2 minutes walk from Watford Junction Train Station "
        },
        {
          question: "Is this the last question",
          answer: "yes"
        }
      ];

      resolve(questionAndAnswersData);
    }, CONSTANTS.FAKE_AJAX_TIME_DELAY_IN_MS);
  });

  const render = domElement => content => domElement.append(content);
  const renderToQuestionsAndAnswerContainer = render(accordeonContainer);
  const printUsing = printer => method => msg => printer[method](msg);
  const debounce = (fn, waitTime, immediate) => {
    let timeout = undefined;

    return function () {
      let context = this;
      let args = arguments;

      var later = () => {
        timeout = undefined;

        if (!immediate) {
          fn.apply(context, args);
        }
      };

      let callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(later, waitTime);
      if (callNow) {
        fn.apply(context, args);
      }
    };
  };

  const buildAccordeon = (questionAndAnswerData = []) => {
    if (!Array.isArray(questionAndAnswerData)) {
      const printErrorOnConsole = printUsing(console)("error");
      printErrorOnConsole(CONSTANTS.INVALID_ACCORDEON_DATA_FORMAT_EXCEPTION);
      return;
    }

    const documentFragment = document.createDocumentFragment();
    questionAndAnswerData.forEach(el => {
      const questionAndAnswerContainer = document.createElement("div");

      const questionContainer = document.createElement("div");
      const questionContent = document.createElement("span");

      const answerContainer = document.createElement("div");
      const answerContent = document.createElement("span")

      questionAndAnswerContainer.classList += "question-and-answer-container";

      questionContainer.classList += "question-container";
      questionContent.innerHTML = el.question || "";

      answerContainer.classList += "answer-container";
      answerContent.innerHTML = el.answer || "";
      answerContainer.style.display = "none"; // Initial state

      questionContainer.append(questionContent);
      answerContainer.append(answerContent);

      questionAndAnswerContainer.append(questionContainer);
      questionAndAnswerContainer.append(answerContainer);

      documentFragment.append(questionAndAnswerContainer);
    });

    return documentFragment;
  };

  const accordeonClickEventHandler = clickEvent => {
    const { target } = clickEvent;

    if (isQuestionContainer(target)) {
      toggleQuestion(target);
    }

    clickEvent.stopPropagation();
  };

  accordeonContainer.addEventListener(
    "click",
    debounce(accordeonClickEventHandler, CONSTANTS.DEBOUNCE_TIME_IN_MS)
  );

  const hasClass = domElement => desiredClass => domElement.classList.value.includes(desiredClass);
  const isQuestionContainer = domElement => hasClass(domElement)("question-container");

  const toggleQuestion = clickedQuestionDOMElement => {
    const clickedQuestionDOMElementParentNode = clickedQuestionDOMElement.parentNode;

    const currentClickedQuestionAnswerDomElement = [].slice
      .call(clickedQuestionDOMElementParentNode.childNodes)
      .find(
        childNode => hasClass(childNode)("answer-container")
      );

    const currentClickedQuestionDOMElementIsSelected = clickedQuestionDOMElement.classList.value.includes("selected");

    if (currentClickedQuestionDOMElementIsSelected) {
      clickedQuestionDOMElement.classList.remove("selected");
      toggleAnswer(currentClickedQuestionAnswerDomElement)(false);

      return;
    }

    clickedQuestionDOMElement.classList.add("selected");
    toggleAnswer(currentClickedQuestionAnswerDomElement)(true);
  };

  const toggleAnswer = answerContainer => (display) => (
    !!(display) ?
      answerContainer.style.display = "block" :
      answerContainer.style.display = "none"
  );

  const questionAndAnswerData = await getQuestionAndAnswersData();
  renderToQuestionsAndAnswerContainer(buildAccordeon(questionAndAnswerData));
  loadingSpinner.style.display = "none";

})();
