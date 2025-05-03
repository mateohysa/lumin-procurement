import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client, { S3_BUCKET_NAME } from '../config/aws/s3.config.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload a file to S3
 * @param file The file buffer to upload
 * @param originalName Original file name
 * @param contentType MIME type of the file
 * @returns Object containing the file key and URL
 */
export const uploadFile = async (
  file: Buffer,
  originalName: string,
  contentType: string
): Promise<{ key: string; url: string }> => {
  try {
    // Generate a unique file name to prevent collisions
    const fileExtension = originalName.split('.').pop();
    const key = `${uuidv4()}.${fileExtension}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Generate a presigned URL for immediate access
    const url = await getFileUrl(key);
    
    return { key, url };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Get a presigned URL for an S3 object
 * @param key The S3 object key
 * @param expiresIn Expiration time in seconds (default: 3600)
 * @returns Presigned URL
 */
export const getFileUrl = async (key: string, expiresIn = 3600): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    // Generate presigned URL
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate file access URL');
  }
};

/**
 * Delete a file from S3
 * @param key The S3 object key
 * @returns Boolean indicating success
 */
export const deleteFile = async (key: string): Promise<boolean> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return false;
  }
};