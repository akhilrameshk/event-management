import UploadView from '@/components/admin/UploadView';
import { cloudinaryReady } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <UploadView cloudReady={cloudinaryReady()} />;
}
