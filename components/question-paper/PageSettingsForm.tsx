'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PageSettings } from '@/types/question-paper'

interface PageSettingsFormProps {
  pageSettings: PageSettings
  setPageSettings: (settings: PageSettings) => void
}

export function PageSettingsForm({ 
  pageSettings, 
  setPageSettings 
}: PageSettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Settings</CardTitle>
        <CardDescription>Configure page layout and format</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="page_size">Page Size</Label>
          <Select 
            value={pageSettings.page_size} 
            onValueChange={(value) => setPageSettings({...pageSettings, page_size: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
              <SelectItem value="A5">A5 (148 × 210 mm)</SelectItem>
              <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Language Direction</Label>
          <RadioGroup
            value={pageSettings.language_direction}
            onValueChange={(value) => setPageSettings({...pageSettings, language_direction: value})}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ltr" id="ltr" />
              <Label htmlFor="ltr">Left to Right</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rtl" id="rtl" />
              <Label htmlFor="rtl">Right to Left</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Margins (mm)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label htmlFor="margin_top" className="text-sm text-gray-600">Top</Label>
              <Input
                id="margin_top"
                type="number"
                value={pageSettings.margins.top}
                onChange={(e) => setPageSettings({
                  ...pageSettings,
                  margins: {...pageSettings.margins, top: parseInt(e.target.value)}
                })}
              />
            </div>
            <div>
              <Label htmlFor="margin_right" className="text-sm text-gray-600">Right</Label>
              <Input
                id="margin_right"
                type="number"
                value={pageSettings.margins.right}
                onChange={(e) => setPageSettings({
                  ...pageSettings,
                  margins: {...pageSettings.margins, right: parseInt(e.target.value)}
                })}
              />
            </div>
            <div>
              <Label htmlFor="margin_bottom" className="text-sm text-gray-600">Bottom</Label>
              <Input
                id="margin_bottom"
                type="number"
                value={pageSettings.margins.bottom}
                onChange={(e) => setPageSettings({
                  ...pageSettings,
                  margins: {...pageSettings.margins, bottom: parseInt(e.target.value)}
                })}
              />
            </div>
            <div>
              <Label htmlFor="margin_left" className="text-sm text-gray-600">Left</Label>
              <Input
                id="margin_left"
                type="number"
                value={pageSettings.margins.left}
                onChange={(e) => setPageSettings({
                  ...pageSettings,
                  margins: {...pageSettings.margins, left: parseInt(e.target.value)}
                })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}