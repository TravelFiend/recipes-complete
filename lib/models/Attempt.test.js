const Attempt = require('./Attempt');

describe('attempt model', () =>{
    it('should require recipeId', () => {
        const attempt = new Attempt();
        const { errors } = attempt.validateSync();

        expect(errors.recipeId.message).toEqual('Path `recipeId` is required.');
    });

    it('should require dateOfEvent', () => {
        const attempt = new Attempt();
        const { errors } = attempt.validateSync();

        expect(errors.dateOfEvent.message).toEqual('Path `dateOfEvent` is required.');
    });

    it('should require rating', () => {
        const attempt = new Attempt();
        const { errors } = attempt.validateSync();

        expect(errors.rating.message).toEqual('Path `rating` is required.');
    });

    it('should have a rating of 0 or greater', () => {
        const attempt = new Attempt({
            rating: -1
        });

        const { errors } = attempt.validateSync();
        expect(errors.rating.message).toEqual('Path `rating` (-1) is less than minimum allowed value (0).');
    });

    it('should have a rating of less than 11', () => {
        const attempt = new Attempt({
            rating: 11
        });

        const { errors } = attempt.validateSync();
        expect(errors.rating.message).toEqual('Path `rating` (11) is more than maximum allowed value (10).');
    });
});
