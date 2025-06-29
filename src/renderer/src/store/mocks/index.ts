import { NoteInfo } from '@shared/models'

export const notesMock: NoteInfo[] = [
  {
    title: 'Idea',
    lastEditTime: new Date().getTime(),
    content:
      '# Brilliant Ideas 💡\n\nCapture your most creative thoughts here:\n\n- [ ] Build a note-taking app\n- [ ] Create a markdown editor\n- [ ] Design a beautiful interface\n\n## Next Steps\nTurn these ideas into reality!'
  },
  {
    title: 'Recipe',
    lastEditTime: new Date().getTime(),
    content:
      '# Delicious Pasta Recipe 🍝\n\n## Ingredients\n- 400g spaghetti\n- 2 cloves garlic\n- 3 tbsp olive oil\n- Fresh basil\n- Parmesan cheese\n- Salt and pepper\n\n## Instructions\n1. Boil pasta until al dente\n2. Sauté garlic in olive oil\n3. Combine and serve with basil and cheese\n\n*Cooking time: 20 minutes*'
  },
  {
    title: 'Todo',
    lastEditTime: new Date().getTime(),
    content:
      "# Today's Tasks ✅\n\n## Work\n- [ ] Finish project documentation\n- [x] Review pull requests\n- [ ] Attend team meeting at 3 PM\n\n## Personal\n- [ ] Grocery shopping\n- [ ] Call dentist for appointment\n- [x] Morning workout\n\n## Notes\nRemember to backup important files!"
  },
  {
    title: 'Notes',
    lastEditTime: new Date().getTime(),
    content:
      '# Meeting Notes 📝\n\n**Date:** Today\n**Attendees:** Team members\n\n## Key Points\n- Project timeline updated\n- New features discussed\n- Budget allocation reviewed\n\n## Action Items\n1. Update project roadmap\n2. Schedule follow-up meeting\n3. Prepare presentation\n\n---\n*Next meeting: Next week*'
  },
  {
    title: 'Project',
    lastEditTime: new Date().getTime(),
    content:
      '# Project Planning 🚀\n\n## Overview\nBuilding an amazing markdown note-taking application\n\n## Features\n- [x] Basic markdown editing\n- [x] Real-time preview\n- [ ] File management\n- [ ] Search functionality\n- [ ] Export options\n\n## Timeline\n- **Week 1:** Core editor\n- **Week 2:** UI/UX improvements\n- **Week 3:** Advanced features'
  },
  {
    title: 'Journal',
    lastEditTime: new Date().getTime(),
    content:
      "# Daily Journal 📖\n\n## Today's Reflection\nToday was a productive day. Made great progress on the note-taking app and learned some new techniques.\n\n## Highlights\n- Solved a challenging bug\n- Had a great coffee with a friend\n- Read an interesting article about productivity\n\n## Tomorrow's Goals\n- Continue working on the project\n- Go for a morning run\n- Try that new restaurant\n\n*Feeling grateful for the progress made today.*"
  },
  {
    title: 'Shopping',
    lastEditTime: new Date().getTime(),
    content:
      '# Shopping List 🛒\n\n## Groceries\n- [ ] Milk\n- [ ] Bread\n- [ ] Eggs\n- [ ] Apples\n- [ ] Chicken breast\n- [ ] Rice\n- [ ] Yogurt\n\n## Other Items\n- [ ] Light bulbs\n- [ ] Notebook\n- [ ] Batteries\n\n**Budget:** $150\n**Store:** Local supermarket'
  },
  {
    title: 'Review',
    lastEditTime: new Date().getTime(),
    content:
      '# Code Review Notes 👨‍💻\n\n## Pull Request #123\n**Author:** John Doe\n**Changes:** Added user authentication\n\n### Feedback\n- ✅ Clean code structure\n- ✅ Good test coverage\n- ⚠️ Consider adding input validation\n- ⚠️ Update documentation\n\n### Verdict\n**Approved** with minor suggestions\n\n---\n*Review completed on: Today*'
  },
  {
    title: 'Plan',
    lastEditTime: new Date().getTime(),
    content:
      '# Weekly Plan 📅\n\n## Monday\n- Team standup at 9 AM\n- Work on feature implementation\n- Gym session in the evening\n\n## Tuesday\n- Client meeting at 2 PM\n- Code review session\n- Dinner with family\n\n## Wednesday\n- Focus day - deep work\n- Finish documentation\n- Movie night\n\n## Goals for the Week\n- Complete two major features\n- Improve test coverage\n- Maintain work-life balance'
  },
  {
    title: 'Thoughts',
    lastEditTime: new Date().getTime(),
    content:
      '# Random Thoughts 💭\n\n## On Technology\nThe pace of technological advancement is incredible. Every day brings new possibilities and challenges.\n\n## On Learning\n> "The more you learn, the more you realize how much you don\'t know."\n\nThis quote resonates with me as I dive deeper into software development.\n\n## Ideas to Explore\n- Machine learning applications\n- Sustainable technology solutions\n- The future of remote work\n\n## Quote of the Day\n*"Innovation distinguishes between a leader and a follower." - Steve Jobs*'
  }
]
