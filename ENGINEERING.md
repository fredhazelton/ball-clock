# How a rolling-ball clock really works

This is a plain-language guide to the physics behind Fred's ball clock, written for a data scientist. Every factual claim cites a source. Where I am inferring rather than quoting, it says **(inference)**.

## Sources
1. Wikipedia, *Rolling ball clock*: https://en.wikipedia.org/wiki/Rolling_ball_clock
2. circuitousroot.com, *Arrow Mfg. Co. rolling-ball clock, Operation* (a photo teardown): https://circuitousroot.com/oldstuff/rolling-ball/rbc-arrow-op.html
3. Dan's Data, *Review: Time Machine rolling ball clock*: http://www.dansdata.com/timemachine.htm
4. Collectors Weekly, *Arrow Electric Ball Clock* (c. 1978): https://www.collectorsweekly.com/stories/141328-arrow-electric-ball-clock
5. Rick's Arrow Ball Clock Website (repairs, motors): https://sites.google.com/site/ricksarrowballclockwebsite
6. 1995 ACM ICPC World Finals, "Tempus et mobilius" (the ball clock problem): https://bluehawk.monmouth.edu/~rclayton/web-pages/f08-306/ACM/95/prob_b.html, also at http://poj.org/problem?id=1879
7. OEIS A221617 (how many 12-hour periods until the balls return to their starting order): https://oeis.org/A221617/internal
8. US patent 3,672,149, L. A. Howard, *Clock mechanism actuated by successively supplied ball weights*: https://www.freepatentsonline.com/3672149.html

## 1. Each rail is a balance lever
- **Counterweight.** Each rail (the "arm") sits on a pivot and is held level by a counterweight. On the Arrow clock, the minute arm has a hole holding "a non-rolling, dark colored ball added to counterweight the arm" [2]. The Time Machine uses "three un-moving, permanent balls" as counterweights. On the hour rail that ball is silver and sits in the **1** position, so the hours never show zero. The minute and five-minute rails use "inconspicuous black counterweight balls that don't line up with a number" [3]. The same idea appears in Howard's patent: "the weight of each successive ball overcomes the counterweight of the lever and swings it about its pivot" until the ball drops out and "the lever … swing[s] back to its counterbalanced position" [8].
- **Torque, the arithmetic.** Torque about the pivot is the sum of each mass times its distance from the pivot, so τ = Σ mᵢ·g·dᵢ. The counterweight's torque is fixed. Each ball that lands adds m·g·d on the opposite side. The rail stays put while the counterweight wins, and tips the moment the balls win. Because the balls queue at fixed slots, the torque goes up in steps: 1 ball, 2 balls, …, N balls. The designer places the counterweight so the switch from holding to tipping falls between step N and step N+1 **(inference, standard lever statics)**.
- **Why the Nth ball triggers it.** On the Arrow clock, the 5th ball "is prevented from going into the 1-4 ball channel by the 4th ball. The 5-minute ball thus stays … in the short entry channel" [2]. That puts the trigger ball at a spot that adds enough torque to tip the arm, which then "tilt[s] down to the right" [2]. The ACM write-up says the same: "When a fifth ball rolls on to the minute indicator track, its weight causes the track to tilt" [6].
- **Dump and reset.** When the arm tilts, "the 1 through 4-minute balls exit straight to the right … into a ball-return track. The 5-minute ball exits … from the rear channel and goes to the 5-minute arm" [2]. With the balls gone, the counterweight is the bigger torque again and swings the arm back up [8].
- **Damping.** None of my sources describe dampers in desktop ball clocks. I expect any bounce is settled by pivot friction and the arm hitting a fixed stop **(inference)**. Wikipedia mentions a very large custom ball clock built with "automobile shock absorbers" [1], so big builds do damp deliberately.

```
  One rail, seen from the side (not to scale)

        counterweight          pivot
        torque  Cw·dw          (fulcrum)
             │                    │
             ▼                    ▼
           [Cw]━━━━━━━━━━━━━━━━━━━▲━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
            ◄─── dw ───►          │  ● ● ● ●   ◄ balls queue   ┃ end
                                  │  d1 d2 d3 d4                ┃ stop
                                  │   ◄──────── d ─────────►
             holds when:   Cw·dw  >  m·Σdᵢ   (N balls)
             tips when:    Cw·dw  <  m·Σdᵢ + m·d_trigger
                                  (the N+1th ball)
```

## 2. The lift and the reservoir
- On the original design, a motor-driven arm "scoops up a ball every minute". The early clocks used an AC motor turning continuously at 1 RPM. Later "Time Machine" clocks used a low-voltage DC motor that spins once, quickly, and is triggered by a modified quartz movement [1]. Dan's Data measured that arm taking "about ten seconds to rotate", then sitting still for the rest of the minute. It "collects one ball from the end of the return trough at the bottom of the clock" and drops it into a trough leading to the minutes rail [3].
- All the Arrow ball clocks use an Intermatic motor [5].
- The reservoir is a queue. Each minute "the least recently used ball is removed from the queue" [6].

## 3. Carries, the fixed ball, and the top of the hour
- **Carries.** The 5th minute ball goes on to the five-minute rail. The 12th five-minute ball tips that rail; "the first 11 balls exit … and return to the ball supply", and the 12th "falls through a hole in that path, and enters the 1-hour" arm [2].
- **Avoiding jams.** At the top of the hour, the Arrow clock "interrupts the ball stream from the 5-minute path until about 15 seconds after the hour, giving the balls from the other paths time to clear" [2]. The Time Machine does the same job with "a flip-up barrier … moved out of the way by the other end of the rotating arm" [3].
- **It resets to 1:00, not 0:00.** The display runs from 1:00 to 12:59 with no a.m./p.m. [6], and the hour rail always shows at least the fixed ball [3]. At 12:59 the rails show 4 + 11 + 11 balls, plus the fixed ball. The next ball tips all three rails in turn: "At 1:00 all three rails dump their balls to the feed rail at the bottom" [1][4]. The trigger ball that tips the hour rail goes back to the reservoir too, which is how the ACM problem models it [6]. So a real ball clock has **no "empty at midnight" state**. Its biggest event is the **12:59 → 1:00 chain reaction**, which happens every 12 hours. Noon and midnight are ordinary hour changes: 11:59 → 12:00 is a minutes cascade plus one ball added to the hours rail.
- **How I propose to show Fred's "midnight/noon full reset" honestly:** treat the 12:59 → 1:00 cascade as the grand finale. Minutes trips, then five-minutes, then hours, each tipping and spilling in sequence. Every 12 hours this ends with the hour rail back to just its fixed ball. You can preview it with `?t=12:59:50`.

## 4. Makers and the "ball clock problem"
- **Makers.** The Arrow Handicraft Corporation made the "Arrow Electric Ball Clock", c. 1978 [4]. After Arrow stopped production, the design carried on as the **Time Machine** Kinetic Clock [5]. A "Deluxe" model from the 1980s was twice the size and used plastic balls [1]. Newer designs exist, such as KinetiClocK [1]. **Gadgetify** (the source of Fred's video) is a gadget channel, not a maker. I didn't find an authoritative page for an "Arbor Scientific" ball clock, so I'm not making any claims about it.
- **The ball clock problem** (ACM World Finals 1995, problem "Tempus et mobilius") [6]. Every 12 hours the clock shuffles the order of the balls in the queue in a fixed way, which is a permutation. The number of days before the balls are back in their original order is the LCM of that permutation's cycle lengths, divided by 2 to turn 12-hour periods into days. The problem's examples are **30 balls → 15 days** and **45 balls → 378 days** [6]. I re-ran a simulation under the problem's rules (dumped balls return in reverse order) and got both numbers. The minimum is 27 balls [7].

## What this means for the web clock
- Each rail is drawn as a lever: a pivot pin, a short arm carrying a counterweight block, and the long display arm.
- Torque from the balls already on a rail makes it sag slightly, through a damped spring. When the trigger ball arrives it tips past its threshold, dumps, and the counterweight springs it back.
- The counting logic is exactly the 4 / 11 / 11 + fixed-ball scheme from [6].
