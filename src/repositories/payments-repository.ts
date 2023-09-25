import { prisma } from '@/config';
import { PostPaymentInfo } from '@/protocols'


async function readPayments(ticketId: number) {
    let resposta = await prisma.payment.findFirst({
        where: {
            ticketId
        }
    })
    return resposta
}

async function createPayment(card: PostPaymentInfo) {
    let d = new Date();
    let ticket = await prisma.ticket.findFirst({
        where: {
            id: card.ticketId
        }
    })
    
    let tickeType = await prisma.ticketType.findFirst({
        where: {
            id: ticket.ticketTypeId
        }
    })

    let resposta = await prisma.payment.create({
        data : {
            ticketId: card.ticketId,
            value: tickeType.price,
            cardIssuer: card.cardData.issuer,
            cardLastDigits: String(card.cardData.number).substring(String(card.cardData.number).length-4, String(card.cardData.number).length),
            createdAt: d
        }
    })

    let alteração = await prisma.ticket.update({
        where: {
            id: card.ticketId
        },
        data: {
            status: "PAID"
        }
    })
    return resposta;
}

export const paymentRepository = {
    readPayments,
    createPayment
};
