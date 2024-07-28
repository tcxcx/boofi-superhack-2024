import * as readline from "readline";
import { downgradeDatabase } from "../../lib/migrations";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let steps = 1;

const run = async () => {
  await downgradeDatabase(steps);
};

rl.question(
  `You are about to downgrade the database.\n Set number of versions to downgrade (-1 for all, 0 to exit): `,
  (answer) => {
    steps = parseInt(answer);
    if (steps) {
      console.log(`Downgrading ${steps > 0 ? steps : "ALL"} version(s).`);
    } else {
      console.log(`Invalid input. Exiting.`);
      process.exit(0);
    }

    rl.close();

    run()
      .then(() => {
        console.log("Complete!");
        process.exit(0);
      })
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });
  }
);
