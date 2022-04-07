import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from "@douyinfe/semi-illustrations"
import { Button, Empty, Typography } from "@douyinfe/semi-ui"
import { Connect, useConnect, useCanister } from "@connect2ic/react"

export const EmptyPage = () => {
  return (
    <Empty
      image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
      style={{ marginTop: 64 }}
      darkModeImage={
        <IllustrationNoContentDark style={{ width: 150, height: 150 }} />
      }
      title="A TECHNICAL DEMO for Developers"
      description="Probably nothing">
      <p>
        If you <b>ARE NOT</b> a developer, or do not understand what it is, just
        leave it here, nothing harms or affects your assets
      </p>
      <p>
        If you <b>ARE</b> a developer, we simply show you what we can do with
        ME.
        eg: login and make transactions, without extension
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Connect style={{
          background: "var(--semi-color-primary)",
          marginTop: "32px",
          height: "40px",
          padding: "32px 80px",
          fontSize: "20px",
          borderRadius: "32px",
        }} />
      </div>
    </Empty>
  )
}
