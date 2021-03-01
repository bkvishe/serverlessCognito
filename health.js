export const health = async (event, context) => {
    const response = {
        statusCode: 200,
        body: 'All is well.',
      };
    return response;
  };
