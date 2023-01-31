export async function queryHasuraGQL(operationsDoc, operationName, variables) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_URL, {
    method: "POST",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlN0ZXBoZW4iLCJpYXQiOjE2NzUxMjE4ODcsImV4cCI6MTY3NTcyNjY4NywiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiLCJhZG1pbiJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtdXNlci1pZCI6ImJvYiBzYWdhdGF3YSJ9fQ.PI3ovYRzTLfFMlUbPCmJbrG0eMsvpdSKy7xNuU455To",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  console.log("result", await result.json());
  //return await result.json();
}

const operationsDoc = `
    query MyQuery{
        users{
            email
            id
            issuer
            publicAddress
        }
    }`;

export function fetchMyQuery() {
  return queryHasuraGQL(operationsDoc, "MyQuery", {});
}
