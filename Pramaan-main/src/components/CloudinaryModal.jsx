import React, { useState } from 'react';
import { X, Cloud, Key, CheckCircle2, AlertOctagon, RefreshCw, Unplug } from 'lucide-react';
import { cloudinaryService } from '../services/cloudinaryService';

export default function CloudinaryModal({ isOpen, onClose, onConfigChange }) {
  const currentConfig = cloudinaryService.getConfig();
  const [cloudName, setCloudName] = useState(currentConfig.cloudName || '');
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!cloudName.trim()) {
      setStatusMsg({ type: 'error', text: 'Cloud Name is required to establish connection.' });
      return;
    }
    cloudinaryService.connect(cloudName.trim(), apiKey.trim());
    setStatusMsg({ type: 'success', text: `Successfully connected to Cloudinary (${cloudName.trim()})` });
    if (onConfigChange) onConfigChange();
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleConnectPublicVault = () => {
    cloudinaryService.connect('pramaan-field-media', '');
    setCloudName('pramaan-field-media');
    setStatusMsg({ type: 'success', text: 'Connected to verified public environmental asset vault.' });
    if (onConfigChange) onConfigChange();
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleDisconnect = () => {
    cloudinaryService.disconnect();
    setCloudName('');
    setApiKey('');
    setStatusMsg({ type: 'info', text: 'Cloudinary media source disconnected.' });
    if (onConfigChange) onConfigChange();
  };

  const isConnected = cloudinaryService.isConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#191815] border border-[#2C2822] rounded-lg p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#2C2822]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#C8754A]/10 border border-[#C8754A]/30 text-[#C8754A]">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#918A7D] uppercase">Media Layer Configuration</span>
              <h3 className="text-lg font-serif font-medium text-[#EEE7DA]">Cloudinary Settings</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#918A7D] hover:text-[#EEE7DA] hover:bg-[#211F1B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status banner */}
        <div className="my-4">
          {isConnected ? (
            <div className="flex items-center justify-between p-3 rounded bg-[#C8754A]/10 border border-[#C8754A]/30 text-xs">
              <div className="flex items-center gap-2 text-[#EEE7DA]">
                <CheckCircle2 className="w-4 h-4 text-[#D5A04B]" />
                <span>Media Source: <strong className="font-mono text-[#D5A04B]">{currentConfig.cloudName}</strong></span>
              </div>
              <button
                type="button"
                onClick={handleDisconnect}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C75B45] hover:underline"
              >
                <Unplug className="w-3 h-3" />
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded bg-[#C75B45]/15 border border-[#C75B45]/30 text-xs text-[#EEE7DA]">
              <AlertOctagon className="w-4 h-4 text-[#C75B45] shrink-0" />
              <span>MEDIA SOURCE NOT CONNECTED. Connect below to populate field photography and evidence observations.</span>
            </div>
          )}
        </div>

        {statusMsg && (
          <div className={`p-2.5 mb-3 rounded text-xs ${
            statusMsg.type === 'error' ? 'bg-[#C75B45]/20 text-[#C75B45] border border-[#C75B45]/40' :
            statusMsg.type === 'success' ? 'bg-[#D5A04B]/20 text-[#D5A04B] border border-[#D5A04B]/40' :
            'bg-[#211F1B] text-[#918A7D]'
          }`}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#918A7D] mb-1 font-mono uppercase tracking-wider">
              Cloudinary Cloud Name *
            </label>
            <input
              type="text"
              value={cloudName}
              onChange={(e) => setCloudName(e.target.value)}
              placeholder="e.g. pramaan-field-media or your-cloud"
              className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#2C2822] text-[#EEE7DA] placeholder-[#918A7D]/50 focus:outline-none focus:border-[#C8754A]"
            />
          </div>

          <div>
            <label className="block text-[#918A7D] mb-1 font-mono uppercase tracking-wider">
              API Key (Masked & Encrypted Token)
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="••••••••••••••••••••••••"
                className="w-full pl-8 pr-3 py-2 rounded bg-[#11110F] border border-[#2C2822] text-[#EEE7DA] placeholder-[#918A7D]/50 focus:outline-none focus:border-[#C8754A] font-mono"
              />
              <Key className="w-3.5 h-3.5 text-[#918A7D] absolute left-2.5 top-2.5" />
            </div>
            <p className="text-[10px] text-[#918A7D]/70 mt-1">Credentials stored securely in local browser session only.</p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded bg-[#C8754A] hover:bg-[#C8754A]/90 text-[#EEE7DA] font-medium tracking-wide transition-colors"
            >
              Save & Connect Cloudinary
            </button>

            <button
              type="button"
              onClick={handleConnectPublicVault}
              className="w-full py-2 px-4 rounded bg-[#211F1B] hover:bg-[#2C2822] text-[#EEE7DA]/90 border border-[#2C2822] font-medium tracking-wide transition-colors inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3 h-3 text-[#D5A04B]" />
              Connect Verified Public Field Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
