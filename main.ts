const STEP = 250;
let interval = 0, startTime = 0;

function playToneForInterval() {
    if (interval !== 0) {
        basic.showIcon(IconNames.Target);
        music.playTone(Note.CSharp, interval);
        basic.clearScreen();
    }
}

input.onButtonPressed(Button.B, () => {
    interval = randint(1, 12) * STEP;
    console.logValue("new interval: ", interval);
    playToneForInterval();
});

input.onButtonPressed(Button.A, playToneForInterval);

input.onLogoEvent(TouchButtonEvent.Touched, () => {
    if (interval === 0) return;
    startTime = control.millis();
    basic.showIcon(IconNames.House, 0);
});

input.onLogoEvent(TouchButtonEvent.Released, () => {
    if (interval === 0) return;
    const diffTime = control.millis() - startTime;
    const intervalRatio = diffTime / interval;

    console.logValue("diff", diffTime);
    console.logValue("ratio", intervalRatio);

    // Give the user a somewhat good tolerance of 90%-110%,
    // just in case.
    if (intervalRatio < .9) {
        basic.showLeds(
            `. . # . .
             . . # . .
             # . # . #
             . # # # .
             . . # . .`,
            1000
        );

        led.plotBarGraph(diffTime, interval);
    } else if (intervalRatio > 1.1) {
        basic.showLeds(
            `. . # . .
             . # # # .
             # . # . #
             . . # . .
             . . # . .`,
            1000
        );

        // A string is shown instead, as I believe it would certainly be more 
        // helpful than plotting a graph that tells the user nothing.
        basic.showString(`+${Math.roundWithPrecision((diffTime - interval) / 1000, 2)}`);
    } else {
        basic.showIcon(IconNames.Yes);
        music.playTone(Note.CSharp, 1000);
        basic.clearScreen();
    }
});