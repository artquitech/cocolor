// ============================================================================
// LESSON DATA - Teaching Construct
// ============================================================================

export interface Slide {
  title: string;
  content: string; // HTML/Markdown content
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  slides: Slide[];
}

// ============================================================================
// LESSONS DATABASE
// ============================================================================

export const LESSONS: Record<string, Lesson> = {
  ai_intro_001: {
    id: "ai_intro_001",
    title: "Intro to Human–AI Collaboration",
    description: "Understanding the fundamentals of working with AI systems",
    slides: [
      {
        title: "Welcome to Human-AI Collaboration",
        content: `
          <div class="space-y-4">
            <h2 class="text-2xl font-bold text-green-400">What is AI?</h2>
            <p class="text-lg">
              Artificial Intelligence (AI) refers to computer systems designed to
              perform tasks that typically require human intelligence.
            </p>
            <ul class="list-disc list-inside space-y-2 text-md">
              <li>Learning from experience</li>
              <li>Understanding language</li>
              <li>Recognizing patterns</li>
              <li>Solving complex problems</li>
            </ul>
          </div>
        `
      },
      {
        title: "Human + Machine: A New Partnership",
        content: `
          <div class="space-y-4">
            <h2 class="text-2xl font-bold text-green-400">The Collaboration Model</h2>
            <p class="text-lg">
              The future is not about humans VS machines, but humans WITH machines.
            </p>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div class="border border-green-500 p-3 rounded">
                <h3 class="font-bold text-green-300 mb-2">Humans Excel At:</h3>
                <ul class="text-sm space-y-1">
                  <li>• Creativity</li>
                  <li>• Empathy</li>
                  <li>• Strategic thinking</li>
                  <li>• Ethical judgment</li>
                </ul>
              </div>
              <div class="border border-green-500 p-3 rounded">
                <h3 class="font-bold text-green-300 mb-2">AI Excels At:</h3>
                <ul class="text-sm space-y-1">
                  <li>• Processing data</li>
                  <li>• Pattern recognition</li>
                  <li>• Repetitive tasks</li>
                  <li>• Speed & scale</li>
                </ul>
              </div>
            </div>
          </div>
        `
      },
      {
        title: "Types of AI Systems",
        content: `
          <div class="space-y-4">
            <h2 class="text-2xl font-bold text-green-400">Understanding AI Categories</h2>
            <div class="space-y-3">
              <div class="border-l-4 border-green-500 pl-3">
                <h3 class="font-bold text-green-300">Narrow AI (ANI)</h3>
                <p class="text-sm">Designed for specific tasks (e.g., image recognition, chatbots)</p>
              </div>
              <div class="border-l-4 border-green-500 pl-3">
                <h3 class="font-bold text-green-300">General AI (AGI)</h3>
                <p class="text-sm">Theoretical AI with human-like general intelligence</p>
              </div>
              <div class="border-l-4 border-green-500 pl-3">
                <h3 class="font-bold text-green-300">Large Language Models (LLMs)</h3>
                <p class="text-sm">AI trained on vast text data to understand and generate language</p>
              </div>
            </div>
          </div>
        `
      },
      {
        title: "Effective Collaboration Principles",
        content: `
          <div class="space-y-4">
            <h2 class="text-2xl font-bold text-green-400">Best Practices</h2>
            <ol class="list-decimal list-inside space-y-3 text-md">
              <li>
                <span class="font-bold text-green-300">Clear Communication</span>
                <p class="ml-6 text-sm">Be specific and context-aware in your requests</p>
              </li>
              <li>
                <span class="font-bold text-green-300">Iterative Refinement</span>
                <p class="ml-6 text-sm">Treat AI interaction as a conversation, not a one-shot query</p>
              </li>
              <li>
                <span class="font-bold text-green-300">Critical Thinking</span>
                <p class="ml-6 text-sm">Always verify AI outputs and apply human judgment</p>
              </li>
              <li>
                <span class="font-bold text-green-300">Ethical Awareness</span>
                <p class="ml-6 text-sm">Consider privacy, bias, and societal impact</p>
              </li>
            </ol>
          </div>
        `
      },
      {
        title: "Real-World Applications",
        content: `
          <div class="space-y-4">
            <h2 class="text-2xl font-bold text-green-400">AI in Action</h2>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-black bg-opacity-50 p-3 rounded border border-green-700">
                <h3 class="font-bold text-green-300 mb-1">Healthcare</h3>
                <p class="text-xs">Diagnosis assistance, drug discovery, patient care</p>
              </div>
              <div class="bg-black bg-opacity-50 p-3 rounded border border-green-700">
                <h3 class="font-bold text-green-300 mb-1">Education</h3>
                <p class="text-xs">Personalized learning, tutoring, content creation</p>
              </div>
              <div class="bg-black bg-opacity-50 p-3 rounded border border-green-700">
                <h3 class="font-bold text-green-300 mb-1">Business</h3>
                <p class="text-xs">Automation, analytics, customer service</p>
              </div>
              <div class="bg-black bg-opacity-50 p-3 rounded border border-green-700">
                <h3 class="font-bold text-green-300 mb-1">Creative Work</h3>
                <p class="text-xs">Design, writing, music, art generation</p>
              </div>
            </div>
          </div>
        `
      },
      {
        title: "Your Journey Begins",
        content: `
          <div class="space-y-4 text-center">
            <h2 class="text-3xl font-bold text-green-400">Next Steps</h2>
            <p class="text-lg">
              You're now ready to start collaborating with AI systems effectively.
            </p>
            <div class="mt-6 space-y-2">
              <p class="text-green-300 font-bold">Key Takeaways:</p>
              <ul class="text-sm space-y-1">
                <li>✓ AI augments human capabilities</li>
                <li>✓ Collaboration requires clear communication</li>
                <li>✓ Always apply critical thinking</li>
                <li>✓ Ethics and responsibility matter</li>
              </ul>
            </div>
            <p class="text-xs text-green-600 mt-6">
              Use 'next slide' / 'previous slide' to navigate<br/>
              Type 'exit lesson' to return to construct
            </p>
          </div>
        `
      }
    ]
  }
};

// Helper function to get a lesson by ID
export function getLessonById(id: string): Lesson | null {
  return LESSONS[id] || null;
}

// Get all available lesson IDs
export function getAvailableLessonIds(): string[] {
  return Object.keys(LESSONS);
}

// Get lesson list for display
export function getLessonList(): Array<{ id: string; title: string; description: string }> {
  return Object.values(LESSONS).map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description
  }));
}
