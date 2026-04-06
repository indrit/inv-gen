'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { APP_NAME, DEFAULT_LOGO } from '@/lib/constants';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { Button } from '../ui/button';
import { Download, Info, Share, PlusSquare, MoreVertical } from 'lucide-react';

export default function PwaBanner() {
    const { isInstallable, handleInstall, platform } = usePwaInstall();
    const [showInstructions, setShowInstructions] = useState(false);

    return (
        <section className="py-12">
            <Card className="overflow-hidden">
                <div className="grid md:grid-cols-2 items-center gap-6">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold tracking-tight">Install {APP_NAME}</h2>
                        <p className="mt-2 text-muted-foreground">
                            Add to your home screen for a faster, more integrated experience with offline access. No app store required.
                        </p>
                        
                        <div className="mt-6 flex flex-col gap-4">
                            {isInstallable ? (
                                <Button onClick={handleInstall} size="lg" className="w-full sm:w-auto">
                                    <Download className="mr-2 h-5 w-5" /> Install App
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setShowInstructions(!showInstructions)}
                                        className="w-full sm:w-auto"
                                    >
                                        <Info className="mr-2 h-5 w-5" /> How to Install
                                    </Button>

                                    {showInstructions && (
                                        <div className="bg-muted p-4 rounded-lg text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                            {platform === 'ios' ? (
                                                <div className="space-y-2">
                                                    <p className="font-semibold flex items-center gap-2">
                                                        <Share className="h-4 w-4" /> 1. Tap the Share button in Safari
                                                    </p>
                                                    <p className="font-semibold flex items-center gap-2">
                                                        <PlusSquare className="h-4 w-4" /> 2. Scroll down and tap "Add to Home Screen"
                                                    </p>
                                                </div>
                                            ) : platform === 'android' ? (
                                                <div className="space-y-2">
                                                    <p className="font-semibold flex items-center gap-2">
                                                        <MoreVertical className="h-4 w-4" /> 1. Tap the menu icon (three dots)
                                                    </p>
                                                    <p className="font-semibold flex items-center gap-2">
                                                        <Download className="h-4 w-4" /> 2. Tap "Install app" or "Add to home screen"
                                                    </p>
                                                </div>
                                            ) : (
                                                <p>Open this site in your mobile browser's menu and select "Add to Home Screen".</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="hidden md:flex justify-center items-center p-8 bg-secondary/20">
                        <Image src={DEFAULT_LOGO} alt={`${APP_NAME} App Icon`} width={160} height={160} className="rounded-3xl shadow-xl" data-ai-hint="app icon"/>
                    </div>
                </div>
            </Card>
        </section>
    );
}
