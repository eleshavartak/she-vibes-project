// ══ SAMPLE DATA — T1 Buddy case study ══════════════════════════════════════
const SAMPLE_PLAN = {
  goal: 'Create a portfolio case study for T1 Buddy — a Healthcare UX concept prototype',
  currentStepIndex: 0,
  steps: [
    {
      step: 'Define the narrative arc',
      low:    "Write three sentences only — what sparked the project, what T1 Buddy became, and what changed because of testing. Don't polish it.",
      medium: "Write the opening paragraph of the case study. Start with your friend's experience with T1 diabetes. End with what T1 Buddy set out to solve.",
      high:   'Map the full narrative arc as bullet points across all seven steps — one line each. Spark, research, first prototype, testing, changes, reflection, and outcome. Enough that someone could follow the story without seeing the work.'
    },
    {
      step: 'Document the initial research',
      low:    'Write a list of every research source you used — social listening channels, names of people you spoke to, and any articles or forums you read. No descriptions yet, just the list.',
      medium: 'Write a short paragraph on what you learned from social listening. What patterns came up? What surprised you? Don\'t worry about structure — just get it down.',
      high:   'Write up the full research section — what you did, who you spoke to, what you found, and how it shaped the direction of T1 Buddy. Include both social listening and the patient and UX designer interviews.'
    },
    {
      step: 'Capture solution and prototype',
      low:    'Find and collect all your prototype files, screenshots, and the concept video into one folder. Name them clearly so you know what each one shows.',
      medium: 'Pick the three to five screens that best show what T1 Buddy does. Write one sentence per screen explaining what it is and why it matters.',
      high:   'Write the full solution section — what T1 Buddy is, what problem it solves, how it works, and walk through the key screens with short descriptions of each.'
    },
    {
      step: 'Document testing and interviews',
      low:    'Write a list of everyone you spoke to during testing — role, context, and one thing they said that stuck with you. Just the list, no analysis.',
      medium: 'Write up what happened in one of the interviews — who it was with, what you showed them, and what their main reactions were.',
      high:   'Write the full testing section — who you spoke to (patient, UX designer, doctor), what you showed them, and what the key feedback themes were across all three.'
    },
    {
      step: 'Document results and changes to the prototype',
      low:    "List every change you made to the prototype after testing. One line per change. Don't explain why yet — just what changed.",
      medium: 'Pick the two or three most significant changes and write a short paragraph on each — what the feedback was and what you did differently as a result.',
      high:   'Write the full iteration section — the before and after. What the first prototype looked like, what testing revealed, and how the final prototype addressed each major piece of feedback.'
    },
    {
      step: 'Reflection and next steps',
      low:    "Write three things you would do differently if you had more time. Don't overthink it — just what comes to mind honestly.",
      medium: 'Write a short reflection on what you learned — about designing for chronic illness, about your own process, and about what surprised you.',
      high:   "Write the full reflection section — what worked, what you'd change, what you learned about healthcare UX specifically, and what the next version of T1 Buddy would tackle."
    },
    {
      step: 'Assemble project for portfolio upload',
      low:    'Open your portfolio platform and create a new project. Add the title, a one-line description, and the cover image. Nothing else yet.',
      medium: "Add the goal, the research section, and the solution section to the portfolio entry. Use the text you've already written — just paste and light formatting.",
      high:   'Complete the full portfolio entry — all sections in order, all images placed, narrative arc clear from top to bottom. Ready to make public.'
    }
  ]
}

// ══ STATE ══════════════════════════════════════════════════════════════════
const APP_VERSION = 'v3'
let plan = null
let selectedEnergy = null
let planningSteps = []
let planningGoal = ''
let planningIndex = 0
let confirmedSteps = []

// ══ ROUTING ════════════════════════════════════════════════════════════════
window.addEventListener('load', () => {
  const saved = localStorage.getItem('weekPlan')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.version !== APP_VERSION) {
        localStorage.removeItem('weekPlan')
        show('s-input')
      } else {
        plan = parsed
        showCheckin()
      }
    } catch(e) {
      localStorage.removeItem('weekPlan')
      show('s-input')
    }
  } else {
    show('s-input')
  }
})

function show(id) {
  ['s-input','s-review','s-success','s-checkin','s-task','s-stepcheck']
    .forEach(s => document.getElementById(s).style.display = 'none')
  document.getElementById(id).style.display = 'block'
  window.scrollTo(0, 0)
}

// ══ WEEKEND PLANNING ═══════════════════════════════════════════════════════
function startPlanning() {
  const goalVal = document.getElementById('goal').value.trim()
  const stepsVal = document.getElementById('steps').value.trim()
  const errorMsg = document.getElementById('errorMsg')
  errorMsg.classList.remove('visible')

  if (!goalVal) {
    errorMsg.textContent = 'Please add your goal before generating.'
    errorMsg.classList.add('visible')
    return
  }
  if (!stepsVal) {
    errorMsg.textContent = 'Please add at least one step before generating.'
    errorMsg.classList.add('visible')
    return
  }

  planningGoal = goalVal
  planningSteps = stepsVal.split('\n').map(s => s.trim()).filter(Boolean)
  planningIndex = 0
  confirmedSteps = []
  showReviewStep(0)
}

function showReviewStep(index) {
  const step = planningSteps[index]
  const sample = SAMPLE_PLAN.steps[index] || { low: '', medium: '', high: '' }

  document.getElementById('stepCounter').textContent = `Step ${index + 1} of ${planningSteps.length}`
  document.getElementById('stepName').textContent = step
  document.getElementById('lowTask').value = sample.low
  document.getElementById('medTask').value = sample.medium
  document.getElementById('highTask').value = sample.high

  const isLast = index === planningSteps.length - 1
  document.getElementById('confirmStepBtn').textContent = isLast
    ? 'Confirm — load the week \u2713'
    : `Confirm step ${index + 1} \u2192 next: step ${index + 2}`

  show('s-review')
}

function confirmStep() {
  confirmedSteps.push({
    step: planningSteps[planningIndex],
    low:    document.getElementById('lowTask').value.trim(),
    medium: document.getElementById('medTask').value.trim(),
    high:   document.getElementById('highTask').value.trim()
  })

  const isLast = planningIndex === planningSteps.length - 1
  if (isLast) {
    plan = {
      version: APP_VERSION,
      goal: planningGoal,
      steps: confirmedSteps,
      currentStepIndex: 0,
      loadedAt: new Date().toISOString()
    }
    localStorage.setItem('weekPlan', JSON.stringify(plan))
    show('s-success')
  } else {
    planningIndex++
    showReviewStep(planningIndex)
  }
}

// ══ WEEKNIGHT FLOW ════════════════════════════════════════════════════════
function showCheckin() {
  if (!plan) {
    const saved = localStorage.getItem('weekPlan')
    plan = saved ? JSON.parse(saved) : null
  }
  if (!plan) { show('s-input'); return }

  selectedEnergy = null
  document.querySelectorAll('.energy-option').forEach(el => {
    el.classList.remove('selected-low','selected-medium','selected-high')
  })
  const btn = document.getElementById('seeTaskBtn')
  btn.style.opacity = '0.4'
  btn.style.pointerEvents = 'none'

  document.getElementById('goalBannerText').textContent = plan.goal
  show('s-checkin')
}

function selectEnergy(level) {
  selectedEnergy = level
  document.querySelectorAll('.energy-option').forEach(el => {
    el.classList.remove('selected-low','selected-medium','selected-high')
  })
  const map = { low: 'opt-low', medium: 'opt-mid', high: 'opt-high' }
  document.querySelector('.' + map[level]).classList.add('selected-' + level)
  const btn = document.getElementById('seeTaskBtn')
  btn.style.opacity = '1'
  btn.style.pointerEvents = 'auto'
}

function showTask() {
  if (!selectedEnergy || !plan) return
  const currentStep = plan.steps[plan.currentStepIndex]

  document.getElementById('tonightStepName').textContent = currentStep.step
  document.getElementById('tonightTask').textContent = currentStep[selectedEnergy]

  const tagEl = document.getElementById('tonightEnergyTag')
  const labels = { low: 'Low energy', medium: 'Medium energy', high: 'High energy' }
  const tagClass = { low: 'tag-low', medium: 'tag-medium', high: 'tag-high' }
  tagEl.className = 'tonight-energy-tag ' + tagClass[selectedEnergy]
  tagEl.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:currentColor;display:inline-block;"></span> ${labels[selectedEnergy]}`

  show('s-task')
}

function markDone(intent) {
  if (intent === 'move') {
    plan.currentStepIndex = Math.min(plan.currentStepIndex + 1, plan.steps.length - 1)
    localStorage.setItem('weekPlan', JSON.stringify(plan))
  }
  buildProgressList()
  show('s-stepcheck')
}

// ══ PROGRESS ══════════════════════════════════════════════════════════════
function buildProgressList() {
  if (!plan) return
  const list = document.getElementById('progressList')
  if (!list) return
  list.innerHTML = ''
  plan.steps.forEach((s, i) => {
    const div = document.createElement('div')
    let state, status
    if (i < plan.currentStepIndex)      { state = 'done';     status = 'Completed' }
    else if (i === plan.currentStepIndex) { state = 'current';  status = 'In progress' }
    else                                  { state = 'upcoming'; status = 'Up next' }
    div.className = `progress-item ${state}`
    div.innerHTML = `
      <div class="progress-dot"></div>
      <div>
        <div class="progress-step-name">${s.step}</div>
        <div class="progress-step-status">${status}</div>
      </div>`
    list.appendChild(div)
  })
}

function showStepProgress() {
  buildProgressList()
  document.getElementById('tabProgress').classList.add('active')
  document.getElementById('tabCheckinAgain').classList.remove('active')
  document.getElementById('progressList').style.display = 'flex'
}

// ══ DEMO ══════════════════════════════════════════════════════════════════
function loadDemo() {
  const demoWithVersion = Object.assign({}, SAMPLE_PLAN, { version: APP_VERSION })
  localStorage.setItem('weekPlan', JSON.stringify(demoWithVersion))
  plan = demoWithVersion
  showCheckin()
}