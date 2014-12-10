#!/usr/bin/env python

import numpy as np
from mcni.utils import conversion as Conv

def compute_hE_curve(hmin, hmax, dh, k, l, mat, Ei):
    """given k, l values, compute h, E
    
    mat: convert hkl to Q
    """
    ki = Conv.e2k(Ei)
    kiv = np.array([ki, 0, 0])
    h = np.arange(hmin, hmax, dh) # N
    hkl = np.vstack((h, np.repeat(k, h.size), np.repeat(l, h.size))).T # NX3
    Q = np.dot(hkl, mat) # NX3
    kfv = kiv - Q # NX3
    kf2 = np.sum(kfv**2, -1) # N
    kf = np.sqrt(kf2) # N
    
    # theta is the angle in the scattering plane (x-y)
    theta = np.arctan2(kfv[:, 1], kfv[:, 0]) # N
    # phi is the angle off the scattering plane. sin(phi) = z/r
    phi = np.arcsin(kfv[:, 2], kf)
    
    Ef = kf2 * (Conv.K2V**2 * Conv.VS2E)
    E = Ei - Ef
    return h, E, theta, phi


def test1():
    mat = np.array(
        [[1.,0,0],
         [0,1,0],
         [0,0,1.]])
    h, E, theta, phi = compute_hE_curve(0, 1, 0.02, 1, 1, mat, Ei=60)
    import pylab
    pylab.plot(h,E)
    pylab.show()
    return


def test2():
    a = b = c = 5.431
    from math import pi
    twopi = 2*pi
    ra,rb,rc = [twopi/a, 0,0], [0,twopi/b,0], [0,0,twopi/c]
    u,v = [-1,1,-1], [2,1,-1]
    from xtalori import xtalori2mat
    
    import pylab
    DEG2RAD = np.pi/180
    # for psi in np.arange(-19, 90, 1.):
    # for psi in np.arange(-5, 90, 1.):
    for psi in np.arange(10, 11, 1.):
        psi = psi * DEG2RAD
        mat = np.array(xtalori2mat(ra, rb, rc, u, v, psi))
        import pdb; pdb.set_trace()
        h, E, theta, phi = compute_hE_curve(-12, 0, 0.05, 0, 0, mat, Ei=100)
        # pylab.plot(h,E)
        limit = ((theta<140.*DEG2RAD) * (theta > 3.*DEG2RAD) + (theta < -3*DEG2RAD)*(theta>-15*DEG2RAD)) * (phi<30.*DEG2RAD) * (phi>-30.*DEG2RAD)
        pylab.plot(h[limit],E[limit])
        continue
    pylab.show()
    return


def main():
    test2()
    return


if __name__ == '__main__': main()
