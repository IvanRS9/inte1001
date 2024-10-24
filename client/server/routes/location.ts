import { Hono } from "hono";
import LocationController from "../controller/location";
import { zValidator } from "@hono/zod-validator";
import { locationDTO } from "../dto/locationDTO";




const locations = new Hono();

locations.get('/', async (c) => {
  const controller = new LocationController();
  const result = await controller.getLocation();
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

locations.delete('/:id', async (c) => {
  const controller = new LocationController();
  const id = c.req.param('id');
  console.log('id', id);
  const result = await controller.deleteLocation(id);
  if (result.isOk) {
    console.log('result', result);
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});


locations.get('/logged', async (c) => {
  const controller = new LocationController();
  const result = await controller.getOnlyLoggedLocation();
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

locations.get('/not-logged', async (c) => {
  const controller = new LocationController();
  const result = await controller.getOnlyNotLoggedLocation();
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

locations.post('/', zValidator('json', locationDTO), async (c) => {
  const controller = new LocationController();
  const validated = c.req.valid('json');
  console.log(validated);

  const tokenExists = await controller.tokenExists(validated.token);
  if (tokenExists.isOk) {
    return c.json({ error: 'Token already exists' }, 400);
  }

  const result = await controller.addNewLocation(validated);
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});


locations.post('/login', zValidator('json', locationDTO), async (c) => {
  const controller = new LocationController();
  const validated = c.req.valid('json');

  const result = await controller.addNewLocation(validated);
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
}
);

export default locations;