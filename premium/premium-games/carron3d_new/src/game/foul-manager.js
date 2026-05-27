export const FOUL_TYPES = {
  strikerPocketed: 'strikerPocketed'
};

export class FoulManager {
  evaluate(summary) {
    if (summary.strikerPocketed) {
      return {
        isFoul: true,
        foulType: FOUL_TYPES.strikerPocketed,
        message: 'Foul: striker pocketed.'
      };
    }

    return {
      isFoul: false,
      foulType: '',
      message: ''
    };
  }
}
