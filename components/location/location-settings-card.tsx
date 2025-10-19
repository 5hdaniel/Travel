"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Eye, Share2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface LocationPermissions {
  admin: { canView: boolean; canShare: boolean; canManage: boolean }
  participant: { canView: boolean; canShare: boolean; canManage: boolean }
  commentor: { canView: boolean; canShare: boolean; canManage: boolean }
  viewer: { canView: boolean; canShare: boolean; canManage: boolean }
}

interface LocationSettingsCardProps {
  tripId: string
  initialPermissions?: LocationPermissions
  onSave?: (permissions: LocationPermissions) => void
}

export function LocationSettingsCard({ tripId, initialPermissions, onSave }: LocationSettingsCardProps) {
  const { toast } = useToast()

  const [permissions, setPermissions] = useState<LocationPermissions>(
    initialPermissions || {
      admin: { canView: true, canShare: true, canManage: true },
      participant: { canView: true, canShare: true, canManage: false },
      commentor: { canView: true, canShare: false, canManage: false },
      viewer: { canView: false, canShare: false, canManage: false },
    },
  )

  const [hasChanges, setHasChanges] = useState(false)

  const roleDescriptions = {
    admin: "Set location permissions for all roles",
    participant: "Can view and share location",
    commentor: "Can only view locations",
    viewer: "No location access",
  }

  const handlePermissionChange = (
    role: keyof LocationPermissions,
    permission: "canView" | "canShare" | "canManage",
    value: boolean,
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(permissions)
    }
    setHasChanges(false)
    toast({
      title: "Settings saved",
      description: "Location permissions have been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Live Location Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Location sharing permissions for each role in this trip.</p>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-center p-3 font-medium">
                    <Eye className="h-4 w-4 mx-auto" title="View Locations" />
                  </th>
                  <th className="text-center p-3 font-medium">
                    <Share2 className="h-4 w-4 mx-auto" title="Share Location" />
                  </th>
                  <th className="text-center p-3 font-medium">
                    <Settings className="h-4 w-4 mx-auto" title="Manage Settings" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(permissions) as Array<keyof LocationPermissions>).map((role, index) => (
                  <tr key={role} className={index !== Object.keys(permissions).length - 1 ? "border-b" : ""}>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-foreground capitalize">{role}</p>
                        <p className="text-xs text-muted-foreground">{roleDescriptions[role]}</p>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Switch
                        checked={permissions[role].canView}
                        onCheckedChange={(checked) => handlePermissionChange(role, "canView", checked)}
                        className="mx-auto"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <Switch
                        checked={permissions[role].canShare}
                        onCheckedChange={(checked) => handlePermissionChange(role, "canShare", checked)}
                        className="mx-auto"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <Switch
                        checked={permissions[role].canManage}
                        onCheckedChange={(checked) => handlePermissionChange(role, "canManage", checked)}
                        className="mx-auto"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-2">
              <Eye className="h-3 w-3" />
              <span>View Locations: Can see other members' live locations on the map</span>
            </p>
            <p className="flex items-center gap-2">
              <Share2 className="h-3 w-3" />
              <span>Share Location: Can share their own location with the trip</span>
            </p>
            <p className="flex items-center gap-2">
              <Settings className="h-3 w-3" />
              <span>Manage Settings: Can configure location sharing settings for the trip</span>
            </p>
          </div>

          <Button onClick={handleSave} disabled={!hasChanges} className="w-full">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
