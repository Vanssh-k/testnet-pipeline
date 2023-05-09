

export const requestFilter = (req: any, propName: any) => {
  if(propName !== "headers") return req[propName];

  const { authorization, Authorization, ...rest } = req.headers;

  return rest;
}

export const responseFilter = (res: any, propName: any) => {
  // Doing nothing will keep response empty
  // console.log(propName)
  // console.log(res.propName)
}
