import { createUserOrUpdate } from "@/lib/actions/dynamic.user.actions";

type QueueItem = {
  eventName: string;
  data: any;
};

class EventQueue {
  private queue: QueueItem[] = [];
  private processing: boolean = false;

  enqueue(item: QueueItem) {
    this.queue.push(item);
    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const item = this.queue.shift()!;

    try {
      await this.processItem(item);
    } catch (error) {
      console.error("Error processing queue item:", error);
    }

    // Process next item
    this.processQueue();
  }

  private async processItem(item: QueueItem) {
    if (["user.created", "user.updated"].includes(item.eventName)) {
      await createUserOrUpdate(item.data);
    } else {
      console.log(`Unhandled event: ${item.eventName}`);
    }
  }
}

export const eventQueue = new EventQueue();
