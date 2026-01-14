import { toast } from 'sonner';
import { getProject } from '@/services/projectService';
import { decryptCompat, getVaultKey, initSodium } from '@/lib/crypto';

export const handleProjectClick = async (
  projectId: string,
  vaultKey: Uint8Array | null,
  setProjectVaultKey: (key: Uint8Array) => void,
  router: any
) => {
  if (!vaultKey) {
    toast.error('Vault key not exist.');
    return;
  }
  try {
    const project = await getProject(projectId);
    const currProjPass = await decryptCompat(
      project.passwordNonce,
      project.passwordCiphertext,
      vaultKey
    );
    console.log(">>> Current Project Password:", currProjPass);
    await initSodium();
    const projectVaultKey = await getVaultKey(
      currProjPass,
      project.vaultKdfSalt,
      project.vaultKdfParams,
      project.wrappedVaultKey
    );
    setProjectVaultKey(projectVaultKey);
    router.push(`/project/${project.id}/service`);
  } catch (err) {
    console.error('Failed to access project:', err);
    toast.error('Failed to access project. Please try again.');
  }
};