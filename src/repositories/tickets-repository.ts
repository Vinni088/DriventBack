import { prisma } from '@/config';

async function readTicketTypes() {
    let resposta = await prisma.ticketType.findMany({

    })
    return resposta
}

async function readTicketsFromUser(userId: number) {

    let resposta = await prisma.$queryRaw`
    SELECT 
    	T.id, 
    	T.status, 
    	T."ticketTypeId", 
    	T."enrollmentId", 
    	JSON_AGG(JSON_BUILD_OBJECT(
            'id', TP.id,
            'name', TP.name,
            'price', TP.price,
            'isRemote', TP."isRemote",
        	'includesHotel', TP."includesHotel",
        	'createdAt', TP."createdAt",
        	'updatedAt', TP."updatedAt"
        ) ORDER BY TP.id) AS "TicketType",
    	T."createdAt",
        T."updatedAt"
    FROM "Ticket" T
    LEFT JOIN "TicketType" TP
    	ON TP.id = T."ticketTypeId" 
    WHERE T."enrollmentId" = (SELECT id FROM "Enrollment" WHERE "userId" = ${userId} LIMIT 1)
    GROUP BY t.id`;

    return resposta

}

async function checkEnrollment(userId: number) {
    let resposta = await prisma.enrollment.findFirst({
        where: {
            userId
        }
    })

    return resposta
}

async function createTicket(userId: number) {
    /*let resposta = prisma.ticket.create({
        
    })

    return resposta*/
}

export const ticketRepository = {
    readTicketTypes,
    checkEnrollment,
    readTicketsFromUser
};
