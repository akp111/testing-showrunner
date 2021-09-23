import { Container } from 'typedi';
import config from '../../../config';
import { EventDispatcher, EventDispatcherInterface } from '../../../decorators/eventDispatcher';

export default async (app: Router) => {
  const logger = Container.get('logger');
  const eventDispatcher = Container.get(EventDispatcherInterface);

  // DISABLED FOR NOW
  // await initializeEPNS(logger, eventDispatcher)

  // const thirtyMins = 30 * 60 * 1000; // Thirty mins
  // setInterval(async function(){
  //   await deleteEPNSInstance();
  //   await initializeEPNS(logger, eventDispatcher)
  // }, thirtyMins);
}
