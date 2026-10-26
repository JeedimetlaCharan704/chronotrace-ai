import asyncio
import edge_tts
import os

TEXT = """Hi everyone, I'm Charan. Every engineering team has experienced this nightmare: a user submits a ten-second screen recording of a broken web app with zero logs and the note: "It froze." Developers spend hours scrubbing video frames, setting breakpoints, and guessing which state mutated incorrectly.

This is ChronoTrace AI: the autonomous video-to-bug archaeology and self-healing engine, built for the Devpost Build With AI Basics Hackathon.

ChronoTrace treats screen recordings as forensic flight data. Watch Quadrant 1: our temporal video scrubber parses user actions frame by frame.
At T equals 3.2 seconds, the user selects shipping. At T equals 7.8 seconds, the cursor moves to the Pay Button and clicks.
Immediately at T equals 8.5 seconds, the button starts spinning, and at T equals 10.2 seconds, ChronoTrace detects an unhandled deadlock anomaly. Notice how the glowing bounding box tracks the target DOM element in real time.

Now, without needing server logs or Sentry SDKs, Quadrant 2 visualizes the exact causal propagation chain: the click triggered processPaymentThunk, which failed at src/features/cart/reducer.ts, Line 42.
Why? Because for guest users, user.address is undefined, causing an uncaught TypeError on postalCode.

Now look at Quadrant 3: ChronoTrace didn't just guess a fix — it synthesized an automated Playwright reproduction test.
Let's click "Run Reproduction Test".
Watch the live terminal: it launches Chromium, executes the user flow, and catches the exact unhandled promise rejection with full stack traces. The test fails, proving the bug is real and reproducible.

Now the magic: Quadrant 4 generates the surgical fix — adding optional chaining and a guest postalCode fallback.
When I click "Apply Patch & Verify", ChronoTrace injects the patch and re-runs the entire Playwright test suite against the remediated code.
In 1.8 seconds: one passed, zero failed, 100% healthy. The bug is permanently solved with zero collateral regressions.

Building ChronoTrace using the Devpost Learn Skill Pack completely transformed our workflow. By locking in our scope.md and prd.md before writing code, we prevented AI hallucination and delivered a complete, coherent product experience.

ChronoTrace AI: From ambiguous video to verified production fix in 30 seconds. Try our live demo on Vercel or inspect our public repository on GitHub. Thank you!"""

async def generate():
    voice = "en-IN-PrabhatNeural"
    output_file = os.path.abspath("voiceover.mp3")
    print(f"[*] Generating voiceover audio with voice: {voice}...")
    communicate = edge_tts.Communicate(TEXT, voice, rate="+2%")
    await communicate.save(output_file)
    print(f"[+] Voiceover generated successfully: {output_file} ({os.path.getsize(output_file)} bytes)")

if __name__ == "__main__":
    asyncio.run(generate())
