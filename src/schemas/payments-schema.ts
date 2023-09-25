import Joi from 'joi';

export const postPaymentSchema = Joi.object({
    ticketId: Joi.number().required(),
    cardData: Joi.object({
        issuer: Joi.string().required(),
        number: Joi.number().required(),
        name: Joi.string().required(),
        expirationDate: Joi.required(),
        cvv: Joi.number().required()
    }).required()
});

/*{
	ticketId: number,
	cardData: {
		issuer: string,
        number: number,
        name: string,
        expirationDate: Date,
        cvv: number
	}
}*/