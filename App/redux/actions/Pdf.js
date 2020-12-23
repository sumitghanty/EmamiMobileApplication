export const REQUEST = 'PDF';

export function pdf(userId,password,department,flag,folderId,repositoryId,tripId,tripNo,personId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: 	`getPdfUrl`,
        headers: {
          'userId': userId,
          'password': password,
          'department': department,
          'flag': flag,
          'folderid': folderId,
          'repositoryId': repositoryId,
          'tripId': tripId,
          'tripNo': tripNo,
          'personId': personId
        },
        
      }
    }
  };
}
