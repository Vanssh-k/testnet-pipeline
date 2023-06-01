import SHA256 from 'crypto-js/sha256'

export const requestFilter = (req: any, propName: any) => {
  if(propName !== "headers") return req[propName];

  const { authorization, Authorization, ...rest } = req.headers;
  authorization?
    rest['Authorisation'] = SHA256(authorization??'').toString()
    :
    rest['Authorisation'] = SHA256(Authorization??'').toString()
  ;
  return rest;
}

export const responseFilter = (res: any, propName: any) => {
  // Doing nothing will keep response empty
  // console.log(propName)
  // console.log(res.propName)
}
