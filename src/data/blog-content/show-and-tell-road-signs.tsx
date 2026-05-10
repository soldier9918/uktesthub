import { Link } from "@tanstack/react-router";
import { SignFlipCard } from "@/components/SignFlipCard";
import { SHOW_AND_TELL_SIGNS } from "@/data/show-and-tell-signs";

export function ShowAndTellRoadSignsBody() {
  const signs = SHOW_AND_TELL_SIGNS;

  return (
    <>
      <p>
        Welcome to <strong>Show &amp; Tell</strong> — an interactive board for
        learning UK road signs. Each card below shows a real road sign on the
        front. <strong>Tap any card</strong> and it will flip to reveal the
        sign's name and what it means in plain English.
      </p>
      <p>
        This is the fastest way to drill the signs you keep forgetting: see the
        shape, guess the meaning in your head, then flip to check. When you can
        get every card right without flipping, you're ready for the{" "}
        <Link
          to="/topic/$slug"
          params={{ slug: "road-signs" }}
          className="font-semibold text-coral hover:underline"
        >
          road signs practice tests
        </Link>
        .
      </p>

      <h2>The interactive board</h2>

      {signs.length === 0 ? (
        <div className="not-prose rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-coral">
            Coming soon
          </p>
          <p className="mt-3 text-base text-muted-foreground">
            The interactive sign cards are being added. Check back shortly — all
            19 signs will appear here as a tap-to-flip board.
          </p>
        </div>
      ) : (
        <div className="not-prose grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {signs.map((s) => (
            <SignFlipCard key={s.id} sign={s} />
          ))}
        </div>
      )}

      <h2>How to use this page</h2>
      <ul>
        <li>
          <strong>Cover the meaning.</strong> Before you flip a card, say the
          sign's meaning out loud or in your head.
        </li>
        <li>
          <strong>Flip to check.</strong> If you were right, move on. If you
          were wrong, flip back, study the shape, and revisit it after the next
          five cards.
        </li>
        <li>
          <strong>Repeat in short bursts.</strong> Five minutes a day for a
          week beats one long session. The signs will start appearing in your
          head the moment you see the shape.
        </li>
        <li>
          <strong>Then take a mock.</strong> Once you can flip the whole board
          with no mistakes, jump into a{" "}
          <Link
            to="/topic/$slug"
            params={{ slug: "road-signs" }}
            className="font-semibold text-coral hover:underline"
          >
            road signs mock test
          </Link>{" "}
          to lock it in under exam conditions.
        </li>
      </ul>

      <h2>Why this works for the theory test</h2>
      <p>
        UK road signs follow a strict colour and shape system — red triangles
        warn, red circles prohibit, blue circles instruct, green and blue
        rectangles direct. Once your eye recognises the shape, the meaning
        follows almost automatically. Flashcards train exactly that recall: pair
        a visual with its meaning, then test the link. It's the same technique
        DVSA examiners recommend in their official learning materials.
      </p>

      <p>
        For the full reference — every shape, colour and category — see our{" "}
        <Link
          to="/blog/$slug"
          params={{ slug: "complete-uk-road-signs-reference" }}
          className="font-semibold text-coral hover:underline"
        >
          Complete UK Road Signs Reference
        </Link>
        .
      </p>
    </>
  );
}
