import { connectDB } from '@/lib/db'
import Setting from '@/models/setting'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        await connectDB()
        const settings = await Setting.findOne({})

        if (!settings) {
            return NextResponse.json({ message: "No settings found" }, { status: 404 })
        }


return NextResponse.json({ name: settings.name, logo: settings.logo }, { status: 200 })

    }
    catch (err) {
        console.error("Internal server Error", err)
        return NextResponse.json(
            { message: "Internal server error while fetching settings" },
            { status: 500 }
        )

    }

}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const setting = await req.json()

    let newSetting = await Setting.findOne({})
    if (!newSetting) {
      newSetting = new Setting(setting)
    } else {
      newSetting.name = setting.name
      newSetting.logo = setting.logo
    }

    await newSetting.save()

    return NextResponse.json(newSetting, { status: 200 })
  } catch (err) {
    console.error("Error updating settings:", err)
    return NextResponse.json(
      { message: "Failed to update settings" },
      { status: 500 }
    )
  }
}
