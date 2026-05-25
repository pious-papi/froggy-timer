# Project Decisions & Evaluation

## 1. How to Run
- Local Setup:
  1. Jump into the project's root folder: `cd adhd-frog-timer`
  2. Pull down the needed project packages: `npm install`
  3. Spin up the local development instance: `npm run dev`
  4. Fire up your browser and open: http://localhost:3000
- Live Site URL: Not deployed yet.

## 2. Stack & Design Choices
- Tech Stack: I went with Next.js (React) paired with Tailwind CSS. When you are building a timer that forces the screen to rewrite every single second, manually targeting and mutating DOM nodes with vanilla JavaScript gets messy quickly and opens the door for memory leaks. React handles these high-frequency renders gracefully using isolated states. Tailwind was an easy choice for styling because it lets me lock down strict structural boundaries inline, preventing weird CSS cascade issues later.
- Visual/Interaction Choice 1 (The Solid-Black Status Banner): Instead of putting a boring text header at the top, I built a chunkier, high-contrast status banner in the upper right. For an ADHD mind, minimizing text processing is key. By glancing at the app, the user gets an immediate confirmation of what mode is currently active (STATUS: FOCUS vs STATUS: BREAK) without having to process changing numbers.
- Visual/Interaction Choice 2 (The Heavy Block Shadows): Every button and primary container uses a thick, raw black shadow offset. When you click a button, it actively shifts down and narrows the shadow. This recreates the physical click of a real button or an index card being pressed into a desk. That snappy, tactile feedback makes interacting with the app feel incredibly satisfying and intentional.

## 3. Responsive & Accessibility
- Layout Adaptation: On a wide monitor, the interface sits cleanly in the dead center of the screen using simple flexbox alignment. On a tiny 360px screen, things get cramped fast. To protect the ASCII art from wrapping and breaking, I downscaled the wrapper padding, pulled back on component spacing, and dynamically dropped the character font size to exactly 11px on tiny devices. This keeps the graphic grid perfectly aligned and readable on an old phone without causing horizontal scrolling.
- Handled Accessibility: Color contrast is maxed out. By sticking to absolute black ink on bright white backgrounds, the entire app meets strict accessibility contrast standards naturally, making it incredibly easy on overstimulated or tired eyes. Focus indicators also use thick borders for clear keyboard navigation.
- Skipped Consideration: I deliberately didn't add ARIA live announcements to the countdown digits. Having a screen reader announce every single passing second out loud creates massive auditory clutter that defeats the purpose of a focus tool, especially for someone dealing with sensory overload.

## 4. AI Usage
- Tools Used: I used Gemini to help map out the initial countdown state logic and generate the foundational layout strings for the ASCII art stages.
- What I Changed: The AI originally spat out the ASCII frames inside loose template strings using standard flexible CSS properties. When shrunk down to a mobile view, the characters warped completely and the text art melted into a jumbled mess. I completely stripped that out, forced the art inside rigid preformatted tags, set a explicit line-height and tracking setup, and wrote custom responsive font steps to guarantee the text grid stacks identically on both desktop and mobile screens.

## 5. Honest Gap
- The Flaw: The app's audio alert relies entirely on a raw browser AudioContext electronic bleep. While it does a great job of cutting through background noise when a cycle ends, there are currently no volume controls or a quick mute switch built into the UI. If you are working in a quiet library or coffee shop, you have to mute your entire system sound to keep the app quiet.
- The Fix: If I had another day, I would add a simple, high-contrast audio toggle button right next to the status banner. This would let users switch between an audible chime, a clean visual-only screen flash, or complete silence by clamping the synthesis gain multiplier directly to zero.
