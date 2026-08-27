export function executeAction(action, analysis) {
  switch (action.id) {
    case "reminder":
      return {
        type: "reminder",
        title: "Reminder prepared",
        message: `Reminder created for ${
          analysis.object.name
        }.`,
      };

    case "task":
      return {
        type: "task",
        title: "Task created",
        message: "Payment task added to your RealityOS tasks.",
      };

    case "navigate":
      return {
        type: "navigate",
        title: "Navigation ready",
        message: "Nearby payment centers are ready to open.",
      };

    default:
      return {
        type: "success",
        title: "Action completed",
        message: "RealityOS completed the action.",
      };
  }
}