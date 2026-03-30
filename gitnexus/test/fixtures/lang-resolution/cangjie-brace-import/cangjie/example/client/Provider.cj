package example.client

import example.svc.{getEngineService}

/**
 * Selective `import pkg.{sym}` must still resolve package + factory return type for this.engine.*.
 */
public class Provider {
    private let engine = getEngineService()

    public init() {}

    public func fetchSettings(peerType: String): Int32 {
        return this.engine.engineGet(peerType)
    }
}
