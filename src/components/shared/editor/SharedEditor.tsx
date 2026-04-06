'use client';

import { Form } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

import { SharedHeader } from './SharedHeader';
import { SharedParties } from './SharedParties';
import { SharedMetadata } from './SharedMetadata';
import { SharedTable } from './SharedTable';
import { SharedSummary } from './SharedSummary';
import { SharedAttachments } from './SharedAttachments';
import { SharedActionsBar } from './SharedActionsBar';
import { SharedPreview } from './SharedPreview';
import { GuestLimitDialog } from '@/components/auth/GuestLimitDialog';

interface SharedEditorProps {
  type: 'invoice' | 'estimate';
  hook: any; // The return value of useInvoiceEditor or useEstimateEditor
}

export default function SharedEditor({ type, hook }: SharedEditorProps) {
  const {
    form,
    fields,
    append,
    remove,
    watchedLineItems,
    logo,
    prompt,
    setPrompt,
    isPreviewOpen,
    setIsPreviewOpen,
    showDiscount,
    setShowDiscount,
    showShipping,
    setShowShipping,
    logoInputRef,
    isMounted,
    subtotal,
    tax,
    total,
    balanceDue,
    currencies,
    currentCurrency,
    handleDownload,
    handleSave,
    handleLogoClick,
    handleLogoChange,
    handleImageUpload,
    removeImage,
    handleGoogleLogin,
    handleEmailSignIn,
    handleEmailSignUp,
    user,
    isPremium,
    clients,
    formatClientAsString,
  } = hook;

  const isInvoice = type === 'invoice';
  const showWatermark = !isPremium;

  return (
    <>
      <SharedActionsBar
        form={form}
        user={user}
        currencies={currencies}
        handleSave={handleSave}
        setIsPreviewOpen={setIsPreviewOpen}
        handleDownload={handleDownload}
        type={type}
      />

      <div className="w-full mx-auto py-6 sm:py-12">
        <Form {...form}>
          <div className="bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden min-h-[800px]">
            <div className="p-4 sm:p-8 md:p-10 lg:p-12 space-y-8 md:space-y-12">
              <SharedHeader
                form={form}
                logo={logo}
                handleLogoClick={handleLogoClick}
                logoInputRef={logoInputRef}
                handleLogoChange={handleLogoChange}
                type={type}
              />

              <SharedParties
                form={form}
                clients={clients}
                formatClientAsString={formatClientAsString}
              />

              <SharedMetadata
                form={form}
                isMounted={isMounted}
                type={type}
              />

              <SharedTable
                form={form}
                fields={fields}
                append={append}
                remove={remove}
                watchedLineItems={watchedLineItems}
                currentCurrency={currentCurrency}
              />

              <SharedAttachments
                form={form}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                isPremium={isPremium}
              />

              <SharedSummary
                form={form}
                subtotal={subtotal}
                tax={tax}
                total={total}
                balanceDue={balanceDue}
                currentCurrency={currentCurrency}
                showDiscount={showDiscount}
                setShowDiscount={setShowDiscount}
                showShipping={showShipping}
                setShowShipping={setShowShipping}
                type={type}
              />
            </div>
          </div>
        </Form>
      </div>

      {/* Hidden container for PDF generation */}
      <div className="fixed left-[-9999px] top-0 w-[850px]" aria-hidden="true">
        <div id={`${type}-pdf-content-hidden`}>
          <SharedPreview 
            data={form.getValues()} 
            logo={logo} 
            isPremium={isPremium} 
            watermark={showWatermark} 
            type={type}
          />
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0 border-none bg-gray-100">
          <DialogHeader className="p-6 bg-white border-b sticky top-0 z-10 flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-xl font-bold uppercase tracking-tight">
                {isInvoice ? 'Invoice' : 'Estimate'} Preview
            </DialogTitle>
            <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(false)} className="h-9">
                    Close
                </Button>
                <Button 
                    size="sm"
                    onClick={() => { handleDownload(); setIsPreviewOpen(false); }} 
                    className="h-9 bg-[#00a67e] hover:bg-[#00a67e]/90"
                >
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
            </div>
          </DialogHeader>
          <div className="py-12 px-4 flex justify-center">
            <SharedPreview 
                data={form.getValues()} 
                logo={logo} 
                isPremium={isPremium} 
                watermark={showWatermark} 
                type={type}
            />
          </div>
        </DialogContent>
      </Dialog>

      <GuestLimitDialog
        open={prompt === 'login'}
        onOpenChange={(open) => setPrompt(open ? 'login' : null)}
        onGoogleLogin={handleGoogleLogin}
        onEmailSignIn={handleEmailSignIn}
        onEmailSignUp={handleEmailSignUp}
      />
    </>
  );
}
