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
    answer: `I'm completing my BSc in Digital Systems at <a href="https://www.ds.unipi.gr/en/home-en/" target="_blank" rel="noopener">University of Piraeus</a>, graduating in September. My coursework covers algorithms, machine learning, distributed systems, data analysis and information technology.`,
  },
  {
    question: "What are your research interests?",
    answer: `I'm drawn to [your interests — e.g. NLP, computer vision, formal methods]. I've explored these through [a project / a paper / a lab internship]. I'm especially excited about the intersection of [X] and [Y].`,
  },
  {
    question: "What projects have you built?",
    answer: `Some highlights:<br>
• <a href="https://github.com/you/project-a" target="_blank" rel="noopener">Project A</a> — [one-line description].<br>
• <a href="https://github.com/you/project-b" target="_blank" rel="noopener">Project B</a> — [one-line description].<br>
See everything on my <a href="https://github.com/yourusername" target="_blank" rel="noopener">GitHub</a>.`,
  },
  {
    question: "Why are you applying for a Masters?",
    answer: `I want to go beyond coursework and contribute original research in [field]. I'm particularly drawn to programs with strong [X] faculty, and I believe a Masters is the right step toward [long-term goal — e.g. a PhD / industry research role].`,
  },
  {
    question: "What's your technical stack?",
    answer: `Primary languages: Python and [other]. Comfortable with [frameworks — e.g. PyTorch, React]. I also have experience with [databases / cloud tools / etc.].`,
  },
  {
    question: "How can I contact you?",
    answer: `Reach me at <a href="mailto:you@email.com">you@email.com</a> or connect on <a href="https://linkedin.com/in/you" target="_blank" rel="noopener">LinkedIn</a>. Happy to chat about research, collaborations, or anything else.`,
  },
];


// =====================================================
const chatWindow  = document.getElementById('chatWindow');
const chipsContainer = document.getElementById('chips');

// Set greeting
document.querySelector('#greeting .bubble').innerHTML = GREETING;

// Render clickable question chips
function renderChips() {
  chipsContainer.innerHTML = '';
  QA.forEach((qa, i) => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = qa.question;
    btn.style.animationDelay = `${i * 0.055}s`;
    btn.addEventListener('click', () => handleQuestion(qa));
    chipsContainer.appendChild(btn);
  });
}

// Handle a question click
function handleQuestion(qa) {
  // Hide chips while answering
  chipsContainer.style.visibility = 'hidden';

  addMessage('user', qa.question);

  const typingMsg = addTyping();

  // Simulate a short think delay
  const delay = 700 + Math.random() * 350;
  setTimeout(() => {
    typingMsg.remove();
    addMessage('bot', qa.answer);

    // Re-show chips after answer lands
    setTimeout(() => {
      chipsContainer.style.visibility = 'visible';
      renderChips();
    }, 250);
  }, delay);
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
