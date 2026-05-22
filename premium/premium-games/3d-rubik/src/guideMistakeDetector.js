import { getGuideStatus } from "./guideManager.js";

function completedStageIds(status) {
  if (!status?.stages?.length) return new Set();
  return new Set(
    status.stages
      .filter((stage, index) => index <= status.index && stage.detector?.(status.state))
      .map((stage) => stage.id)
  );
}

export function captureGuideSnapshot(state, activeStageIndex = 0) {
  const status = getGuideStatus(state, activeStageIndex);
  return {
    state,
    stage: status.stage,
    activeStageIndex,
    completed: Boolean(status.completed),
    completedIds: completedStageIds({ ...status, state }),
    targets: status.targets
  };
}

export function detectGuideMistake(snapshot, state, activeStageIndex = 0) {
  if (!snapshot?.completedIds?.size) {
    return null;
  }

  const nextStatus = getGuideStatus(state, activeStageIndex);
  const disturbed = [...snapshot.completedIds].filter((stageId) => {
    const stage = nextStatus.stages.find((candidate) => candidate.id === stageId);
    return stage && !stage.detector?.(state);
  });

  if (!disturbed.length) {
    return null;
  }

  return {
    title: "Careful, that move disturbed a solved step.",
    message: `${snapshot.stage?.title || "This guide step"} was solved before that move. Undo is available if you want to keep the guided path tidy.`,
    disturbedStageIds: disturbed,
    targets: snapshot.targets
  };
}
