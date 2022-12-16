// TODO: fix any
export const Opt = <T>(value?): [T] | [] => {
  return (value || value === 0) ? ([value]) : []
}
