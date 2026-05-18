async function generateTasks() {
  const goal = document.getElementById('goal').value.trim()
  const steps = document.getElementById('steps').value.trim()
  const btn = document.getElementById('generateBtn')
  const loading = document.getElementById('loading')
  const results = document.getElementById('results')
  const resultsHeader = document.getElementById('resultsHeader')
  const confirmBtn = document.getElementById('confirmBtn')
  const errorMsg = document.getElementById('errorMsg')

  errorMsg.classList.remove('visible')
  results.classList.remove('visible')
  resultsHeader.style.display = 'none'
  confirmBtn.classList.remove('visible')

  if (!goal) {
    errorMsg.textContent = 'Please add your goal for the week before generating.'
    errorMsg.classList.add('visible')
    return
  }

  if (!steps) {
    errorMsg.textContent = 'Please add at least one step before generating.'
    errorMsg.classList.add('visible')
    return
  }

  btn.disabled = true
  loading.classList.add('visible')

  const prompt = `You are helping a UX designer make progress on Healthcare Design during one-hour weekday evening blocks.

Her goal this week: ${goal}

Steps she has identified:
${steps}

Create three versions of tasks for this week — one for a low energy evening, one for medium, and one for high energy. Each version should ladder toward the same weekly goal but be sized appropriately for that energy level.

Low energy: Small, contained, low-friction. Something completable in 20-30 minutes that still moves the work forward. No decisions required.

Medium energy: A solid hour of focused work. Meaningful progress. Some thinking involved but not overwhelming.

High energy: A full productive session. Deeper work, more output, real momentum on the goal.

Be specific. Reference the actual steps she listed. Do not be generic.

Respond in this exact JSON format with no additional text:
{
  "low": "specific task description for low energy evening",
  "medium": "specific task description for medium energy evening",
  "high": "specific task description for high energy evening"
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    const text = data.content[0].text.trim()
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    document.getElementById('lowTask').textContent = parsed.low
    document.getElementById('medTask').textContent = parsed.medium
    document.getElementById('highTask').textContent = parsed.high

    resultsHeader.style.display = 'block'
    results.classList.add('visible')
    confirmBtn.classList.add('visible')

  } catch (err) {
    errorMsg.textContent = 'Something went wrong generating your tasks. Try again — and if it keeps failing, check that the API is connected.'
    errorMsg.classList.add('visible')
  }

  btn.disabled = false
  loading.classList.remove('visible')
}

function confirmWeek() {
  document.getElementById('results').classList.remove('visible')
  document.getElementById('resultsHeader').style.display = 'none'
  document.getElementById('confirmBtn').classList.remove('visible')
  document.getElementById('success').classList.add('visible')
}