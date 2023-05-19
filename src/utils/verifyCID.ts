export default (cid: string) => {
  if (cid.startsWith('Qm')) {
    return /^[A-HJ-NP-Za-km-z1-9]*$/.test(cid) && cid.length == 46
  }
  if (cid.startsWith('b')) {
    return cid.length >= 50
  }
  return false
}
