package example.client

import example.svc.*

/**
 * `this.engine.engineGet()` must resolve to Engine.engineGet, not a same-file self-call.
 */
public class Provider {
    private let engine = getEngineService()

    public init() {}

    public func fetchSettings(peerType: String): Int32 {
        return this.engine.engineGet(peerType)
    }
}
