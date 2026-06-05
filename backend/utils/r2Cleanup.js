const { ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");

async function listAllObjects(client, bucket, prefix) {
  const keys = [];
  let token;
  do {
    const res = await client.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: token,
    }));
    for (const obj of res.Contents ?? []) keys.push(obj.Key);
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

async function deleteAllObjectsForUser(client, bucket, userId) {
  const prefix = `uploads/${userId}/`;
  const keys = await listAllObjects(client, bucket, prefix);
  if (keys.length === 0) return { deletedCount: 0 };

  let deleted = 0;
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000);
    const res = await client.send(new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: { Objects: batch.map((Key) => ({ Key })) },
    }));
    deleted += (res.Deleted ?? []).length;
  }
  return { deletedCount: deleted };
}

module.exports = { listAllObjects, deleteAllObjectsForUser };
