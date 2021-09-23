import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import HelloChannel from "./helloChannel"
import middlewares from '../../api/middlewares';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'ethers/lib/utils';

const route = Router();

export default(app: Router) => {
    app.use('/showrunners/hello_world', route);

    route.post(
        '/send_message',
        celebrate({
            body: Joi.object({
                simulate: [Joi.object(), Joi.bool()]
            })
        }),
        middlewares.onlyLocalhost,
        async (req: Request, res: Response, next: NextFunction) => {
            const Logger = Container.get('logger');
            Logger.debug('Calling /showrunners/hello_world/send_messages: %o', req.body);
            try{
                const hello = Container.get(HelloChannel);
                const response = await hello.sendMessageToContracts(req.body.simulate);

                return res.status(201).json(response);
            } catch (e) {
                Logger.error('🔥 error: %o', e);
                return next(e);
            }
        }
    )
}