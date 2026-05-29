// =====================================================
//  GREETING — shown when the page loads
// =====================================================
const GREETING = `Hi! I'm <strong>Michalis</strong>. Pick a question to learn more about me.`;

// =====================================================
//  Q&A DATA — edit questions and answers here.
//  Answers support HTML: use <a href="...">text</a>
//  for clickable links, <strong> for bold, etc.
// =====================================================
const QA = [
  {
    question: "What are you studying?",
    answer: `I'm completing my BSc in Digital Systems at <a href="https://www.ds.unipi.gr/en/home-en/" target="_blank" rel="noopener">University of Piraeus</a>, graduating in September. My coursework covers algorithms, AI, machine learning, distributed systems, data analysis and information technology.`,
  },
  {
    question: "What are your research interests?",
    answer: `My main interests are in Data Science, Machine Learning, Information Retrieval, and applied AI systems.

I am especially interested in retrieval augmented generation, embedding based retrieval, vector indexing, model evaluation, and optimization. A recurring theme in my work is understanding how AI systems behave beyond the model itself: how data is retrieved, indexed, ranked, evaluated, and transformed into useful outputs.
`
  },
  {
    question: "What projects have you built?",
    answer: `I have built projects across information retrieval, NLP, spatial data processing, and intelligent agents.

Some selected projects include:     

• Hotel Skylines: an end to end pipeline for scraping hotel data, preprocessing it, building an R-tree, and applying skyline algorithms to identify Pareto optimal hotel choices based on price and distance.

• TileWorld AgentSpeak: a Java/Jason multi-agent simulation using BDI agents, reward aware A* search, and a custom Contract Net Protocol for task allocation.

I have also worked professionally on RAG systems, natural language to SQL tools, custom ML models, and AI applications for document heavy workflows.`,
  },
  {
    question: "Why are you applying for a Masters?",
    answer: `I am applying for a Master’s because my professional experience has made me want to understand AI and machine learning systems at a deeper level.
    A Master’s is also important for me because it gives structure and academic depth to skills I have already started developing through work and projects. I want to strengthen my theoretical foundations, improve my ability to read and conduct research, and become better at evaluating and designing robust AI systems.
`,
  },
  {
    question: "What's your technical stack?",
    answer: `My main stack includes Python, Java, SQL, Git, Jupyter and Docker.

On the data science and AI side, I work with machine learning pipelines, NLP models, embeddings, vector search, retrieval augmented generation, model evaluation, and LLM based applications.

I also have experience with information retrieval systems, relational databases, custom ML models, local LLM tooling, and agent-based systems. More broadly, I am comfortable working across the full pipeline: data acquisition, preprocessing, modeling and evaluation.`,
  },
  {
    question: "How can I contact you?",
    answer: `Reach me at <a href="mailto:mikechar2002@gmail.com">mikechar2002@gmail.com</a> or connect on <a href="https://www.linkedin.com/in/michalis-charisis-62b350214/" target="_blank" rel="noopener">LinkedIn</a>. Happy to chat about research, collaborations, or anything else.`,
  },
];


// =====================================================
const chatWindow  = document.getElementById('chatWindow');
const chipsContainer = document.getElementById('chips');
const avatarSpeech = document.getElementById('avatarSpeech');
const askedQuestions = new Set();

const QUESTION_THRESHOLD = 3;
let questionsAsked = 0;
let avatarSpeechShown = false;
let avatarSpeechTimeoutId = null;
const TOKEN_LIMIT_MESSAGE = 'You are running out of tokens! Feel free to ask a few more questions, or check out my resume ';
const FINAL_AVATAR_MESSAGE = 'You know me pretty well now.';
const MASTERS_QUESTION = 'Why are you applying for a Masters?';

// Set greeting
document.querySelector('#greeting .bubble').innerHTML = GREETING;

// Render clickable question chips
function renderChips() {
  chipsContainer.innerHTML = '';
  const availableQuestions = getAvailableQuestions();

  availableQuestions.forEach((qa, i) => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = qa.question;
    btn.style.animationDelay = `${i * 0.055}s`;
    btn.addEventListener('click', () => handleQuestion(qa));
    chipsContainer.appendChild(btn);
  });
}

function getAvailableQuestions() {
  if (questionsAsked < QUESTION_THRESHOLD) {
    return QA.slice();
  }

  return QA.filter((qa) => !askedQuestions.has(qa.question));
}

// Handle a question click
function handleQuestion(qa) {
  const availableQuestions = getAvailableQuestions();
  const isFinalQuestion = availableQuestions.length === 1;
  const shouldSimulateReasoning = qa.question === MASTERS_QUESTION;

  // Hide chips while answering
  chipsContainer.style.visibility = 'hidden';
  askedQuestions.add(qa.question);
  questionsAsked += 1;

  addMessage('user', qa.question);

  const typingMsg = addTyping();

  // Simulate a short think delay
  const delay = 700 + Math.random() * 350;
  setTimeout(() => {
    typingMsg.remove();
    const answerFlow = shouldSimulateReasoning
      ? runComplexThinkingSequence()
      : Promise.resolve();

    answerFlow.then(() => addStreamedMessage('bot', qa.answer)).then(() => {
      if (isFinalQuestion) {
        showAvatarSpeech(FINAL_AVATAR_MESSAGE, null);
      }

      if (!avatarSpeechShown && questionsAsked === QUESTION_THRESHOLD) {
        showAvatarSpeech(TOKEN_LIMIT_MESSAGE);
        avatarSpeechShown = true;
        scrollPageToTop();
      }

      // Re-show chips after answer lands
      setTimeout(() => {
        renderChips();

        if (getAvailableQuestions().length > 0) {
          chipsContainer.style.visibility = 'visible';
        } else {
          chipsContainer.style.visibility = 'hidden';
        }
      }, 250);
    });
  }, delay);
}

function showAvatarSpeech(message, durationMs = 4000) {
  if (!avatarSpeech) {
    return;
  }

  if (avatarSpeechTimeoutId) {
    window.clearTimeout(avatarSpeechTimeoutId);
    avatarSpeechTimeoutId = null;
  }

  avatarSpeech.textContent = message;
  avatarSpeech.classList.add('is-visible');

  if (durationMs === null) {
    return;
  }

  avatarSpeechTimeoutId = window.setTimeout(() => {
    avatarSpeech.classList.remove('is-visible');
    avatarSpeech.textContent = '';
    avatarSpeechTimeoutId = null;
  }, durationMs);
}

async function runComplexThinkingSequence() {
  const thinkingSteps = [
    'Thinking about the academic fit...',
    'Weighing research depth against practical experience...',
    'Connecting those goals to long term growth...'
  ];

  const reasoningMsg = document.createElement('div');
  reasoningMsg.className = 'message bot';

  const bubble = document.createElement('div');
  bubble.className = 'bubble bubble--streaming';
  reasoningMsg.appendChild(bubble);
  chatWindow.appendChild(reasoningMsg);
  reasoningMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  for (const [index, step] of thinkingSteps.entries()) {
    bubble.textContent = step;
    await sleep(1500);
  }

  reasoningMsg.remove();
}

function scrollPageToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addMessage(role, html) {
  const msg    = document.createElement('div');
  msg.className = `message ${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = html;
  msg.appendChild(bubble);
  chatWindow.appendChild(msg);
  bubble.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  return msg;
}

function addStreamedMessage(role, html) {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble bubble--streaming';
  msg.appendChild(bubble);
  chatWindow.appendChild(msg);
  msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  return streamHTMLIntoBubble(bubble, normalizeAnswerHTML(html));
}

function normalizeAnswerHTML(html) {
  return html
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .join('<br>');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTokenDelay(token) {
  const trimmed = token.trim();

  if (!trimmed) {
    return 0;
  }

  const punctuationPause = /[.!?]$/.test(trimmed)
    ? 90
    : /[,:;]$/.test(trimmed)
      ? 45
      : 0;

  return 18 + Math.min(24, trimmed.length * 1.5) + punctuationPause + Math.random() * 12;
}

function createTokenSpan(text) {
  const token = document.createElement('span');
  token.className = 'stream-token';
  token.textContent = text;
  return token;
}

function cloneElementShallow(element) {
  const clone = document.createElement(element.tagName.toLowerCase());

  for (const attribute of element.attributes) {
    clone.setAttribute(attribute.name, attribute.value);
  }

  return clone;
}

async function streamNode(node, target) {
  if (node.nodeType === Node.TEXT_NODE) {
    const tokens = node.textContent.match(/\S+|\s+/g) || [];

    for (const token of tokens) {
      if (/^\s+$/.test(token)) {
        target.appendChild(document.createTextNode(token));
        continue;
      }

      target.appendChild(createTokenSpan(token));
      target.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      await sleep(getTokenDelay(token));
    }

    return;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName === 'BR') {
      target.appendChild(document.createElement('br'));
      target.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      await sleep(20);
      return;
    }

    const clone = cloneElementShallow(node);
    target.appendChild(clone);

    for (const child of node.childNodes) {
      await streamNode(child, clone);
    }
  }
}

async function streamHTMLIntoBubble(bubble, html) {
  const template = document.createElement('template');
  template.innerHTML = html;

  for (const child of template.content.childNodes) {
    await streamNode(child, bubble);
  }

  bubble.classList.remove('bubble--streaming');
}

function addTyping() {
  const msg = document.createElement('div');
  msg.className = 'message bot';
  msg.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
  chatWindow.appendChild(msg);
  msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  return msg;
}

// Kick things off
renderChips();
