export function createRegResponse(
  name: string,
  index: string,
  error = false,
  errorText = ""
) {
  const data = JSON.stringify({
    name,
    index,
    error,
    errorText,
  });
  const response = {
    type: "reg",
    data,
    id: 0,
  };
  return JSON.stringify(response);
}
